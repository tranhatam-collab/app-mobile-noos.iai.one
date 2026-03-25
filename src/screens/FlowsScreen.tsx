import { View, Text, FlatList, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radius, space, type } from "../theme/tokens";

const MOCK_FLOWS = [
  {
    id: "f1",
    name: "Health intent → gợi ý lộ trình",
    steps: "parse → policy → consent → queue",
  },
  {
    id: "f2",
    name: "Twin delta sync (stub)",
    steps: "trust check → federate → evidence",
  },
  {
    id: "f3",
    name: "Map layer: Risk overlay",
    steps: "degraded nếu layer fail",
  },
];

export function FlowsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.kicker}>FLOW</Text>
        <Text style={styles.title}>Workflow</Text>
        <Text style={styles.sub}>
          Danh sách demo — runtime thật nối flow-engine sau.
        </Text>
      </View>
      <FlatList
        data={MOCK_FLOWS}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardMeta}>{item.steps}</Text>
          </View>
        )}
      />
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
});
