import { noosClient } from "../api/noosClient";

/**
 * Mars latency + offline rollback harness (dev-only).
 *
 * Mục tiêu:
 * - Không cần backend thật vẫn validate được:
 *   1) UI có thể chịu delay
 *   2) Evidence/Intent placeholders được tạo
 *   3) Rollback path có thể chạy trong degraded/local mode
 *
 * Cách dùng (dev):
 * - Import hàm và gọi trong một context test nội bộ (node/relay/devtools).
 * - Không phụ thuộc thư viện test runner.
 */
export async function runMarsLatencyOfflineRollbackHarness(params?: {
  marsLatencyMs?: number;
  delayTolerant?: boolean;
}) {
  const marsLatencyMs = params?.marsLatencyMs ?? 2000;
  const delayTolerant = params?.delayTolerant ?? true;

  const t0 = Date.now();
  const askRes = await noosClient.submitAsk("Tôi muốn sống tốt hơn.", {
    language: "vi",
    delayTolerant,
    forceOffline: true,
    marsLatencyMs,
  });
  const submitMs = Date.now() - t0;

  const t1 = Date.now();
  const rollbackRes = await noosClient.rollbackIntent(askRes.intent.id);
  const rollbackMs = Date.now() - t1;

  return {
    marsLatencyMs,
    submitMs,
    rollbackMs,
    intentId: askRes.intent.id,
    intentApprovalStateAfterRollback: rollbackRes.intent.approvalState,
    evidenceRecordIdAfterRollback: rollbackRes.evidenceRecord.id,
  };
}

