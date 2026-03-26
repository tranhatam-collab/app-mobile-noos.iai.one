import { View, Text, FlatList, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radius, space, type } from "../theme/tokens";
import { useNoosSession } from "../state/NoosSessionProvider";
import { useNetDegraded } from "../hooks/useNetDegraded";

export function FlowsScreen() {
  const insets = useSafeAreaInsets();
  const { offline } = useNetDegraded();
  const { currentIntent, evidenceRecords } = useNoosSession();

  const flows = currentIntent
    ? [
        {
          id: currentIntent.id,
          name: "Intent execution pipeline",
          steps: "create intent → consent gate → approve/reject/rollback → evidence",
          approvalState: currentIntent.approvalState,
        },
      ]
    : [];

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.kicker}>FLOW</Text>
        <Text style={styles.title}>Workflow runtime</Text>
        <Text style={styles.sub}>
          Danh sách runtime theo contract. Offline: degraded view.
        </Text>
      </View>
      {offline ? (
        <Text style={styles.degraded}>Mất kết nối: chưa thể cập nhật execution từ backend.</Text>
      ) : null}

      {flows.length ? (
        <FlatList
          data={flows}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardMeta}>{item.steps}</Text>
              <Text style={styles.stateLine}>
                approvalState: <Text style={styles.stateValue}>{item.approvalState}</Text>
              </Text>
            </View>
          )}
        />
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Chưa có execution</Text>
          <Text style={styles.emptyBody}>
            Vào Home để “Ask NOOS…” tạo intent & EvidenceRecord.
          </Text>
          {evidenceRecords.length ? (
            <Text style={styles.emptyBody}>Bạn đã có evidence nhưng chưa có intent active.</Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: space.md, paddingBottom: space.md },
  kicker: {
    color: colors.accent,
    fontSize: type.micro,
    letterSpacing: 1.2,
    marginBottom: space.xs,
  },
  title: {
    color: colors.text,
    fontSize: type.title,
    fontWeight: "700",
  },
  sub: {
    color: colors.muted,
    fontSize: type.small,
    marginTop: space.sm,
    lineHeight: 20,
  },
  list: { paddingHorizontal: space.md, paddingBottom: space.xl * 2 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.md,
    marginBottom: space.sm,
  },
  cardTitle: {
    color: colors.text,
    fontSize: type.body,
    fontWeight: "600",
  },
  cardMeta: {
    color: colors.muted2,
    fontSize: type.small,
    marginTop: 6,
  },
  degraded: {
    marginHorizontal: space.md,
    marginTop: space.sm,
    color: colors.warning,
    fontSize: type.small,
    lineHeight: 20,
  },
  stateLine: {
    marginTop: space.sm,
    color: colors.muted,
    fontSize: type.small,
    lineHeight: 20,
  },
  stateValue: {
    color: colors.text,
    fontWeight: "700",
  },
  empty: {
    paddingHorizontal: space.md,
    paddingTop: space.md,
  },
  emptyTitle: {
    color: colors.accent3,
    fontWeight: "700",
    fontSize: type.body,
  },
  emptyBody: {
    marginTop: 8,
    color: colors.muted2,
    fontSize: type.small,
    lineHeight: 20,
  },
});
