import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ConsentChain, EvidenceRecord, Intent } from "../types/noosContract";
import { noosClient } from "../api/noosClient";

type NoosSessionStatus = "idle" | "submitting" | "approving" | "error";

export type NoosSessionState = {
  status: NoosSessionStatus;
  error?: string;
  currentIntent?: Intent;
  currentEvidenceRecord?: EvidenceRecord;
  evidenceRecords: EvidenceRecord[];
  consentChain?: ConsentChain;
  submitAsk: (text: string) => Promise<void>;
  approveCurrentIntent: () => Promise<void>;
  rejectCurrentIntent: () => Promise<void>;
  rollbackCurrentIntent: () => Promise<void>;
  clear: () => void;
};

const NoosSessionContext = createContext<NoosSessionState | undefined>(undefined);

export function useNoosSession(): NoosSessionState {
  const ctx = useContext(NoosSessionContext);
  if (!ctx) throw new Error("useNoosSession must be used inside NoosSessionProvider");
  return ctx;
}

export function NoosSessionProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<NoosSessionStatus>("idle");
  const [error, setError] = useState<string | undefined>(undefined);
  const [currentIntent, setCurrentIntent] = useState<Intent | undefined>(undefined);
  const [currentEvidenceRecord, setCurrentEvidenceRecord] = useState<EvidenceRecord | undefined>(
    undefined,
  );
  const [evidenceRecords, setEvidenceRecords] = useState<EvidenceRecord[]>([]);
  const [consentChain, setConsentChain] = useState<ConsentChain | undefined>(undefined);

  const clear = useCallback(() => {
    setStatus("idle");
    setError(undefined);
    setCurrentIntent(undefined);
    setCurrentEvidenceRecord(undefined);
    setEvidenceRecords([]);
    setConsentChain(undefined);
  }, []);

  const submitAsk = useCallback(async (text: string) => {
    setStatus("submitting");
    setError(undefined);
    try {
      const res = await noosClient.submitAsk(text);
      setCurrentIntent(res.intent);
      setCurrentEvidenceRecord(res.evidenceRecord);
      setConsentChain(res.consentChain);
      setEvidenceRecords((prev) => [res.evidenceRecord, ...prev].slice(0, 20));
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const approveCurrentIntent = useCallback(async () => {
    if (!currentIntent?.id) return;
    setStatus("approving");
    setError(undefined);
    try {
      const res = await noosClient.approveIntent(currentIntent.id);
      setCurrentIntent(res.intent);
      setCurrentEvidenceRecord(res.evidenceRecord);
      setConsentChain(res.consentChain);
      setEvidenceRecords((prev) => [res.evidenceRecord, ...prev].slice(0, 20));
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [currentIntent]);

  const rejectCurrentIntent = useCallback(async () => {
    if (!currentIntent?.id) return;
    setStatus("approving");
    setError(undefined);
    try {
      const res = await noosClient.rejectIntent(currentIntent.id);
      setCurrentIntent(res.intent);
      setCurrentEvidenceRecord(res.evidenceRecord);
      setConsentChain(res.consentChain);
      setEvidenceRecords((prev) => [res.evidenceRecord, ...prev].slice(0, 20));
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [currentIntent]);

  const rollbackCurrentIntent = useCallback(async () => {
    if (!currentIntent?.id) return;
    setStatus("approving");
    setError(undefined);
    try {
      const res = await noosClient.rollbackIntent(currentIntent.id);
      setCurrentIntent(res.intent);
      setCurrentEvidenceRecord(res.evidenceRecord);
      setConsentChain(res.consentChain);
      setEvidenceRecords((prev) => [res.evidenceRecord, ...prev].slice(0, 20));
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [currentIntent]);

  const value = useMemo<NoosSessionState>(
    () => ({
      status,
      error,
      currentIntent,
      currentEvidenceRecord,
      evidenceRecords,
      consentChain,
      submitAsk,
      approveCurrentIntent,
      rejectCurrentIntent,
      rollbackCurrentIntent,
      clear,
    }),
    [
      status,
      error,
      currentIntent,
      currentEvidenceRecord,
      evidenceRecords,
      consentChain,
      submitAsk,
      approveCurrentIntent,
      rejectCurrentIntent,
      rollbackCurrentIntent,
      clear,
    ],
  );

  return <NoosSessionContext.Provider value={value}>{children}</NoosSessionContext.Provider>;
}

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ConsentChain, EvidenceRecord, Intent } from "../types/noosContract";
import { noosClient } from "../api/noosClient";

type NoosSessionStatus = "idle" | "submitting" | "approving" | "error";

export type NoosSessionState = {
  status: NoosSessionStatus;
  error?: string;

  currentIntent?: Intent;
  currentEvidenceRecord?: EvidenceRecord;
  evidenceRecords: EvidenceRecord[];
  consentChain?: ConsentChain;

  submitAsk: (text: string) => Promise<void>;
  approveCurrentIntent: () => Promise<void>;
  rejectCurrentIntent: () => Promise<void>;
  rollbackCurrentIntent: () => Promise<void>;

  clear: () => void;
};

const NoosSessionContext = createContext<NoosSessionState | undefined>(undefined);

export function useNoosSession(): NoosSessionState {
  const ctx = useContext(NoosSessionContext);
  if (!ctx) {
    throw new Error("useNoosSession must be used inside NoosSessionProvider");
  }
  return ctx;
}

export function NoosSessionProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<NoosSessionStatus>("idle");
  const [error, setError] = useState<string | undefined>(undefined);

  const [currentIntent, setCurrentIntent] = useState<Intent | undefined>(undefined);
  const [currentEvidenceRecord, setCurrentEvidenceRecord] = useState<EvidenceRecord | undefined>(
    undefined,
  );
  const [evidenceRecords, setEvidenceRecords] = useState<EvidenceRecord[]>([]);
  const [consentChain, setConsentChain] = useState<ConsentChain | undefined>(undefined);

  const clear = useCallback(() => {
    setStatus("idle");
    setError(undefined);
    setCurrentIntent(undefined);
    setCurrentEvidenceRecord(undefined);
    setEvidenceRecords([]);
    setConsentChain(undefined);
  }, []);

  const submitAsk = useCallback(async (text: string) => {
    setStatus("submitting");
    setError(undefined);
    try {
      const res = await noosClient.submitAsk(text);
      setCurrentIntent(res.intent);
      setCurrentEvidenceRecord(res.evidenceRecord);
      setConsentChain(res.consentChain);
      setEvidenceRecords((prev) => [res.evidenceRecord, ...prev].slice(0, 20));
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : String(e));
    }
  }, []);

  const approveCurrentIntent = useCallback(async () => {
    if (!currentIntent?.id) return;
    setStatus("approving");
    setError(undefined);
    try {
      const res = await noosClient.approveIntent(currentIntent.id);
      setCurrentIntent(res.intent);
      setCurrentEvidenceRecord(res.evidenceRecord);
      setConsentChain(res.consentChain);
      setEvidenceRecords((prev) => [res.evidenceRecord, ...prev].slice(0, 20));
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [currentIntent]);

  const rejectCurrentIntent = useCallback(async () => {
    if (!currentIntent?.id) return;
    setStatus("approving");
    setError(undefined);
    try {
      const res = await noosClient.rejectIntent(currentIntent.id);
      setCurrentIntent(res.intent);
      setCurrentEvidenceRecord(res.evidenceRecord);
      setConsentChain(res.consentChain);
      setEvidenceRecords((prev) => [res.evidenceRecord, ...prev].slice(0, 20));
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [currentIntent]);

  const rollbackCurrentIntent = useCallback(async () => {
    if (!currentIntent?.id) return;
    setStatus("approving");
    setError(undefined);
    try {
      const res = await noosClient.rollbackIntent(currentIntent.id);
      setCurrentIntent(res.intent);
      setCurrentEvidenceRecord(res.evidenceRecord);
      setConsentChain(res.consentChain);
      setEvidenceRecords((prev) => [res.evidenceRecord, ...prev].slice(0, 20));
      setStatus("idle");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : String(e));
    }
  }, [currentIntent]);

  const value = useMemo<NoosSessionState>(
    () => ({
      status,
      error,
      currentIntent,
      currentEvidenceRecord,
      evidenceRecords,
      consentChain,
      submitAsk,
      approveCurrentIntent,
      rejectCurrentIntent,
      rollbackCurrentIntent,
      clear,
    }),
    [
      status,
      error,
      currentIntent,
      currentEvidenceRecord,
      evidenceRecords,
      consentChain,
      submitAsk,
      approveCurrentIntent,
      rejectCurrentIntent,
      rollbackCurrentIntent,
      clear,
    ],
  );

  return <NoosSessionContext.Provider value={value}>{children}</NoosSessionContext.Provider>;
}

