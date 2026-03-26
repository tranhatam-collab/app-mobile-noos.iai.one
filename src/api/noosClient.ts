import * as Constants from "expo-constants";
import type {
  ConsentChain,
  EvidenceRecord,
  Intent,
  SubmitAskResult,
  DelayTolerantIntent,
  CommandIntent,
  PolicyEnvelope,
} from "../types/noosContract";
import { enqueueAsk, flushQueue, type QueuedAsk } from "../offline/offlineQueue";

export type EvidenceActionResult = {
  intent: Intent;
  evidenceRecord: EvidenceRecord;
  consentChain: ConsentChain;
};

type ActorType = "operator" | "service" | "device";

function getExtra(): Record<string, unknown> {
  // Expo provides extra via app.json -> expo.extra
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const extra = (Constants.expoConfig?.extra ?? {}) as any;
  return (extra ?? {}) as Record<string, unknown>;
}

function getString(key: string, fallback: string): string {
  const v = getExtra()[key];
  return typeof v === "string" ? v : fallback;
}

function getNumber(key: string, fallback: number): number {
  const v = getExtra()[key];
  return typeof v === "number" ? v : fallback;
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function noosFetch<T>(
  path: string,
  init: RequestInit & { jsonBody?: unknown; delayOverrideMs?: number } = {},
): Promise<T> {
  const baseUrl = getString("NOOS_BASE_URL", "https://api.noos.iai.one/v1");
  const authToken = getString("NOOS_AUTH_TOKEN", "");
  const actorType = (getExtra().NOOS_ACTOR_TYPE as ActorType) ?? "operator";
  const signature = getString("NOOS_SIGNATURE", "");
  const twinId = getString("NOOS_TWIN_ID", "");
  const routeMode = getString("NOOS_ROUTE_MODE", "realtime");

  const simMarsLatencyMs =
    typeof init.delayOverrideMs === "number" ? init.delayOverrideMs : getNumber("NOOS_SIM_MARS_LATENCY_MS", 0);
  if (simMarsLatencyMs > 0) {
    // Test harness: mô phỏng delay end-to-end trước khi gọi backend.
    await sleep(simMarsLatencyMs);
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  if (actorType) headers["X-NOOS-Actor-Type"] = actorType;
  if (signature) headers["X-NOOS-Signature"] = signature;
  if (twinId) headers["X-NOOS-Twin-Id"] = twinId;
  if (routeMode) headers["X-NOOS-Route-Mode"] = routeMode;

  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: { ...headers, ...(init.headers as Record<string, string> | undefined) },
    body: init.jsonBody === undefined ? init.body : JSON.stringify(init.jsonBody),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`NOOS API ${path} failed: ${res.status} ${text}`);
  }

  // Some endpoints may return empty body; tolerate.
  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await res.json()) as T;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return undefined as any;
}

function deriveConsentChainFromIntent(intent: Intent): ConsentChain {
  const humanRequired = intent.approvalState === "pending_human";
  const rightToDisconnect = true;
  const bciVetoRequired = true;

  const consentChain: ConsentChain = {
    scope: "intent_runtime",
    humanRequired,
    rightToDisconnect,
    bciVetoRequired,
  };

  // PolicyEnvelope có thể được backend trả ở field phụ; UI phase hiện tại chưa cần chắc chắn.
  // Nếu response có thêm policyEnvelope, UI sẽ consume sau.
  return consentChain;
}

const localIntentCache = new Map<
  string,
  { text: string; language?: string; delayTolerant: boolean; targetTwinId: string }
>();

function isLocalIntentId(intentId: string) {
  return intentId.startsWith("intent_local_");
}

function createLocalIntentAndEvidence(input: {
  text: string;
  language?: string;
  delayTolerant: boolean;
}) {
  const targetTwinId = getString("NOOS_DEFAULT_TARGET_TWIN_ID", "operator_twin_local_001");
  const intentId = `intent_local_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  localIntentCache.set(intentId, {
    text: input.text,
    language: input.language,
    delayTolerant: input.delayTolerant,
    targetTwinId,
  });

  const approvalState = "draft";
  const commonRequestedAction = {
    type: "ask_noos",
    text: input.text,
    language: input.language,
    meaningIdHint: "concept:unknown",
  };

  const intent: Intent = input.delayTolerant
    ? ({
        id: intentId,
        actor: { type: "operator" },
        targetTwinId,
        workflowRef: "flow://ask-noos/default/v1",
        requestedAction: commonRequestedAction,
        approvalState,
        rollbackRef: `rb_local_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        bundleId: `bundle_local_${Date.now()}`,
        expectedDeliveryWindow: {
          earliest: new Date(Date.now() + 60_000).toISOString(),
          latest: new Date(Date.now() + 10 * 60_000).toISOString(),
        },
        priorityOnReconnect: "normal",
        rollbackOnTimeout: false,
        custodyChain: [],
      } as DelayTolerantIntent)
    : ({
        id: intentId,
        actor: { type: "operator" },
        targetTwinId,
        workflowRef: "flow://ask-noos/default/v1",
        requestedAction: commonRequestedAction,
        approvalState,
        rollbackRef: `rb_local_${Date.now()}_${Math.random().toString(16).slice(2)}`,
      } as CommandIntent);

  const evidenceRecord: EvidenceRecord = {
    id: `ev_local_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    claim: `AskEvidence(LOCAL): ${intentId} :: ${input.text}`,
    custodyChain: [],
    confidence: 0.4,
    verificationStatus: "local_placeholder",
  };

  const consentChain = deriveConsentChainFromIntent(intent);

  return { intent, evidenceRecord, consentChain };
}

function createLocalEvidence(claim: string): EvidenceRecord {
  return {
    id: `ev_local_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    claim,
    custodyChain: [],
    confidence: 0.35,
    verificationStatus: "local_placeholder",
  };
}

function updateLocalIntent(intentId: string, approvalState: string): Intent {
  const cached = localIntentCache.get(intentId);
  const targetTwinId =
    cached?.targetTwinId ?? getString("NOOS_DEFAULT_TARGET_TWIN_ID", "operator_twin_local_001");
  const delayTolerant = cached?.delayTolerant ?? false;
  const text = cached?.text ?? "";
  const language = cached?.language;

  const requestedAction = {
    type: "ask_noos",
    text,
    language,
    meaningIdHint: "concept:unknown",
  };

  const rollbackRef = `rb_local_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  return delayTolerant
    ? ({
        id: intentId,
        actor: { type: "operator" },
        targetTwinId,
        workflowRef: "flow://ask-noos/default/v1",
        requestedAction,
        approvalState,
        rollbackRef,
        bundleId: `bundle_local_${Date.now()}`,
        expectedDeliveryWindow: {
          earliest: new Date(Date.now() + 60_000).toISOString(),
          latest: new Date(Date.now() + 10 * 60_000).toISOString(),
        },
        priorityOnReconnect: "normal",
        rollbackOnTimeout: false,
        custodyChain: [],
      } as DelayTolerantIntent)
    : ({
        id: intentId,
        actor: { type: "operator" },
        targetTwinId,
        workflowRef: "flow://ask-noos/default/v1",
        requestedAction,
        approvalState,
        rollbackRef,
      } as CommandIntent);
}

async function createEvidenceRecord(
  claim: string,
): Promise<EvidenceRecord> {
  const id = `ev_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  return noosFetch<EvidenceRecord>("/evidence-records", {
    method: "POST",
    jsonBody: { id, claim },
  });
}

async function createIntent(
  text: string,
  opts: { delayTolerant?: boolean; language?: string } = {},
): Promise<Intent> {
  const defaultTwinId = getString("NOOS_DEFAULT_TARGET_TWIN_ID", "operator_twin_local_001");
  const now = new Date();

  const base: CommandIntent = {
    id: `intent_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    targetTwinId: defaultTwinId,
    workflowRef: "flow://ask-noos/default/v1",
    requestedAction: {
      type: "ask_noos",
      text,
      language: opts.language,
      /**
       * Placeholder for MeaningID/Intent enrichment.
       * Backend sẽ thay bằng parse/NUL thực khi contract parse được chốt đầy đủ.
       */
      meaningIdHint: "concept:unknown",
    },
    approvalState: "draft",
    actor: { type: "operator" },
    rollbackRef: `rb_${Date.now()}_${Math.random().toString(16).slice(2)}`,
  };

  if (!opts.delayTolerant) {
    return noosFetch<CommandIntent>("/intents", {
      method: "POST",
      jsonBody: base,
    });
  }

  const dt: DelayTolerantIntent = {
    ...base,
    bundleId: `bundle_${Date.now()}`,
    expectedDeliveryWindow: {
      earliest: new Date(now.getTime() + 60_000).toISOString(),
      latest: new Date(now.getTime() + 10 * 60_000).toISOString(),
    },
    priorityOnReconnect: "normal",
    rollbackOnTimeout: false,
    custodyChain: [],
  };

  return noosFetch<DelayTolerantIntent>("/intents", {
    method: "POST",
    jsonBody: dt,
  });
}

export const noosClient = {
  /**
   * Ask NOOS (Phase UI wiring):
   * - tạo Intent từ text (thay cho /parse trước khi contract /parse exists)
   * - tạo EvidenceRecord cho chuỗi action
   */
  async submitAsk(
    text: string,
    opts?: { language?: string; delayTolerant?: boolean; forceOffline?: boolean; marsLatencyMs?: number },
  ): Promise<SubmitAskResult> {
    const delayTolerant = opts?.delayTolerant ?? false;
    const language = opts?.language;
    const forceOffline = opts?.forceOffline === true;
    const marsLatencyMs = opts?.marsLatencyMs;

    const envMars = getNumber("NOOS_SIM_MARS_LATENCY_MS", 0);
    const effectiveMars = typeof marsLatencyMs === "number" ? marsLatencyMs : envMars;
    if (effectiveMars > 0) {
      await sleep(effectiveMars);
    }

    if (!forceOffline) {
      // Best-effort flush: nếu trước đó đã queue, thử đẩy lên backend trước.
      void flushQueue(async (item) => {
        const queuedIntent = await createIntent(item.text, {
          delayTolerant: item.delayTolerant,
          language: item.language,
        });
        await createEvidenceRecord(`AskEvidence: ${queuedIntent.id} :: ${item.text}`);
      });
    }

    try {
      if (forceOffline) throw new Error("forced_offline");

      const intent = await createIntent(text, {
        delayTolerant,
        language,
      });

      const evidenceRecord = await createEvidenceRecord(`AskEvidence: ${intent.id} :: ${text}`);
      const consentChain = deriveConsentChainFromIntent(intent);

      return { intent, evidenceRecord, consentChain };
    } catch {
      // Offline-friendly: queue + trả placeholder intent/evidence để UI không crash.
      const queued: QueuedAsk = {
        id: `q_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        createdAtMs: Date.now(),
        text,
        language,
        delayTolerant,
        marsLatencyMs,
      };
      enqueueAsk(queued);

      return createLocalIntentAndEvidence({
        text,
        language,
        delayTolerant,
      });
    }
  },

  async approveIntent(intentId: string): Promise<EvidenceActionResult> {
    try {
      if (isLocalIntentId(intentId)) throw new Error("local_intent");

      const updated = await noosFetch<Intent>(`/intents/${intentId}/approve`, {
        method: "POST",
        jsonBody: {},
      });

      // Evidence (best-effort) - backend có thể thay bằng chain nội tại.
      const evidenceRecord = await createEvidenceRecord(`ApproveEvidence: ${intentId}`);
      const consentChain = deriveConsentChainFromIntent(updated);
      return { intent: updated, evidenceRecord, consentChain };
    } catch {
      const updated = updateLocalIntent(intentId, "approved");
      const evidenceRecord = createLocalEvidence(`ApproveEvidence(LOCAL): ${intentId}`);
      const consentChain = deriveConsentChainFromIntent(updated);
      return { intent: updated, evidenceRecord, consentChain };
    }
  },

  async rejectIntent(intentId: string): Promise<EvidenceActionResult> {
    try {
      if (isLocalIntentId(intentId)) throw new Error("local_intent");
      const updated = await noosFetch<Intent>(`/intents/${intentId}/reject`, {
        method: "POST",
        jsonBody: {},
      });
      const evidenceRecord = await createEvidenceRecord(`RejectEvidence: ${intentId}`);
      const consentChain = deriveConsentChainFromIntent(updated);
      return { intent: updated, evidenceRecord, consentChain };
    } catch {
      const updated = updateLocalIntent(intentId, "rejected");
      const evidenceRecord = createLocalEvidence(`RejectEvidence(LOCAL): ${intentId}`);
      const consentChain = deriveConsentChainFromIntent(updated);
      return { intent: updated, evidenceRecord, consentChain };
    }
  },

  async rollbackIntent(intentId: string): Promise<EvidenceActionResult> {
    try {
      if (isLocalIntentId(intentId)) throw new Error("local_intent");
      const updated = await noosFetch<Intent>(`/intents/${intentId}/rollback`, {
        method: "POST",
        jsonBody: {},
      });
      const evidenceRecord = await createEvidenceRecord(`RollbackEvidence: ${intentId}`);
      const consentChain = deriveConsentChainFromIntent(updated);
      return { intent: updated, evidenceRecord, consentChain };
    } catch {
      const updated = updateLocalIntent(intentId, "rolled_back");
      const evidenceRecord = createLocalEvidence(`RollbackEvidence(LOCAL): ${intentId}`);
      const consentChain = deriveConsentChainFromIntent(updated);
      return { intent: updated, evidenceRecord, consentChain };
    }
  },

  /**
   * Optional: fetch policy envelope if backend returns a policyId out-of-band.
   */
  async getPolicyEnvelope(policyId: string): Promise<PolicyEnvelope> {
    return noosFetch<PolicyEnvelope>(`/policy-envelopes/${policyId}`, { method: "GET" });
  },
};

