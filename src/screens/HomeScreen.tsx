import { useCallback, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AskNoosInput } from "../components/AskNoosInput";
import { ActivityItem, type ActivityEntry } from "../components/ActivityItem";
import { OfflineBanner } from "../components/OfflineBanner";
import { useNetDegraded } from "../hooks/useNetDegraded";
import { colors, space, type } from "../theme/tokens";
import { useNoosSession } from "../state/NoosSessionProvider";

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { offline, label } = useNetDegraded();
  const { submitAsk, currentIntent, currentEvidenceRecord, status, error, evidenceRecords } =
    useNoosSession();

  const onAsk = useCallback(
    async (text: string) => {
      await submitAsk(text);
    },
    [submitAsk],
  );

  const activity = useMemo<ActivityEntry[]>(() => {
    if (!currentIntent) return [];

    const approval = currentIntent.approvalState;
    const state: ActivityEntry["state"] =
      approval === "pending_human" || approval === "draft"
        ? "hold"
        : approval === "rejected" || approval === "rolled_back"
          ? "pending"
          : "ok";

    const main: ActivityEntry = {
      id: currentIntent.id,
      title: currentIntent.requestedAction?.text
        ? String(currentIntent.requestedAction.text).slice(0, 80) +
          (String(currentIntent.requestedAction.text).length > 80 ? "…" : "")
        : "Ask NOOS",
      meta: [
        `intent: ${currentIntent.id}`,
        currentEvidenceRecord ? `evidence: ${currentEvidenceRecord.id}` : "",
      ]
        .filter(Boolean)
        .join(" · "),
      state,
    };

    const evidenceFeed: ActivityEntry[] = evidenceRecords.slice(0, 5).map((ev) => ({
      id: `ev_${ev.id}`,
      title: ev.claim.slice(0, 60) + (ev.claim.length > 60 ? "…" : ""),
      meta: `evidence: ${ev.id}`,
      state: "ok",
    }));

    return [main, ...evidenceFeed].slice(0, 12);
  }, [currentIntent, currentEvidenceRecord, evidenceRecords]);

  return (
    <KeyboardAvoidingView
      style={[styles.root, { paddingTop: insets.top }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <OfflineBanner offline={offline} detail={label} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.kicker}>NOOS · Super App</Text>
        <Text style={styles.headline}>Lớp trải nghiệm</Text>
        <Text style={styles.lead}>
          Meaning · Intent · Consent — mọi action tạo EvidenceRecord (backend).
        </Text>
        <AskNoosInput onSubmit={onAsk} />
        {status === "error" ? (
          <Text style={styles.error}>{error ?? "Unknown error"}</Text>
        ) : null}
        <Text style={styles.section}>Luồng gần đây</Text>
        {activity.length ? (
          activity.map((e) => <ActivityItem key={e.id} entry={e} />)
        ) : (
          <Text style={styles.empty}>Chưa có intent. Nhập “Ask NOOS…” để bắt đầu.</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    padding: space.md,
    paddingBottom: space.xl * 2,
  },
  kicker: {
    color: colors.accent,
    fontSize: type.micro,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: space.xs,
  },
  headline: {
    color: colors.text,
    fontSize: type.title,
    fontWeight: "700",
    marginBottom: space.sm,
  },
  lead: {
    color: colors.muted,
    fontSize: type.body,
    lineHeight: 22,
    marginBottom: space.lg,
  },
  section: {
    color: colors.text,
    fontSize: type.headline,
    fontWeight: "600",
    marginTop: space.lg,
    marginBottom: space.sm,
  },
  error: {
    marginTop: space.sm,
    marginHorizontal: space.md,
    color: colors.danger,
    fontSize: type.small,
    lineHeight: 18,
  },
  empty: {
    color: colors.muted2,
    fontSize: type.small,
    marginTop: space.sm,
    lineHeight: 20,
  },
});
