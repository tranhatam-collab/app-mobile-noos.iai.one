import { useCallback, useState } from "react";
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

const seedActivity: ActivityEntry[] = [
  {
    id: "1",
    title: "Intent mẫu: “Sống tốt hơn”",
    meta: "Chờ parse → MeaningID · degraded mode",
    state: "hold",
  },
  {
    id: "2",
    title: "Consent envelope (demo)",
    meta: "Chưa có API — không ghi evidence",
    state: "pending",
  },
  {
    id: "3",
    title: "Flow runtime",
    meta: "Rollback path reserved",
    state: "ok",
  },
];

export function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { offline, label } = useNetDegraded();
  const [activity, setActivity] = useState<ActivityEntry[]>(seedActivity);

  const onAsk = useCallback((text: string) => {
    const entry: ActivityEntry = {
      id: String(Date.now()),
      title: text.slice(0, 80) + (text.length > 80 ? "…" : ""),
      meta: "Đã nhận — shell chưa gọi POST /parse",
      state: "pending",
    };
    setActivity((prev) => [entry, ...prev].slice(0, 12));
  }, []);

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
          Meaning · Intent · Consent — mọi hành động có evidence và có thể hoàn
          tác (khi backend sẵn sàng).
        </Text>
        <AskNoosInput onSubmit={onAsk} />
        <Text style={styles.section}>Luồng gần đây</Text>
        {activity.map((e) => (
          <ActivityItem key={e.id} entry={e} />
        ))}
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
});
