import { View, Text, StyleSheet } from "react-native";
import { colors, radius, space, type } from "../theme/tokens";

export type ActivityEntry = {
  id: string;
  title: string;
  meta: string;
  state: "pending" | "ok" | "hold";
};

const stateColor = {
  pending: colors.accent,
  ok: colors.accent3,
  hold: colors.gold,
} as const;

export function ActivityItem({ entry }: { entry: ActivityEntry }) {
  return (
    <View style={styles.row}>
      <View style={[styles.dot, { backgroundColor: stateColor[entry.state] }]} />
      <View style={styles.body}>
        <Text style={styles.title}>{entry.title}</Text>
        <Text style={styles.meta}>{entry.meta}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
    marginBottom: space.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: space.md,
  },
  body: { flex: 1 },
  title: {
    color: colors.text,
    fontSize: type.body,
    fontWeight: "500",
  },
  meta: {
    color: colors.muted,
    fontSize: type.small,
    marginTop: 4,
  },
});
