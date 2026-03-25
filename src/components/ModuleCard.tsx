import { Pressable, Text, View, StyleSheet } from "react-native";
import type { NoosModule } from "../types/noos";
import { colors, radius, space, type } from "../theme/tokens";

type Props = {
  module: NoosModule;
  onPress: () => void;
};

export function ModuleCard({ module, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <Text style={styles.icon}>{module.icon}</Text>
      <View style={styles.textCol}>
        <Text style={styles.title}>{module.title}</Text>
        <Text style={styles.sub} numberOfLines={2}>
          {module.subtitle}
        </Text>
      </View>
      <Text style={styles.chev}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: space.md,
    paddingHorizontal: space.md,
    marginBottom: space.sm,
    minHeight: 56,
  },
  cardPressed: {
    backgroundColor: colors.surface2,
    borderColor: colors.lineStrong,
  },
  icon: {
    fontSize: 22,
    color: colors.accent,
    width: 36,
    textAlign: "center",
  },
  textCol: { flex: 1, paddingHorizontal: space.sm },
  title: {
    color: colors.text,
    fontSize: type.headline,
    fontWeight: "600",
  },
  sub: {
    color: colors.muted,
    fontSize: type.small,
    marginTop: 4,
    lineHeight: 18,
  },
  chev: {
    color: colors.muted2,
    fontSize: 22,
    fontWeight: "300",
  },
});
