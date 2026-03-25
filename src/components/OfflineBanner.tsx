import { View, Text, StyleSheet } from "react-native";
import { colors, radius, space, type } from "../theme/tokens";

type Props = { offline: boolean; detail: string };

export function OfflineBanner({ offline, detail }: Props) {
  if (!offline) {
    return (
      <View style={[styles.strip, styles.stripInfo]}>
        <Text style={styles.stripText}>{detail}</Text>
      </View>
    );
  }
  return (
    <View style={[styles.strip, styles.stripWarn]}>
      <Text style={styles.stripTextStrong}>Mất kết nối</Text>
      <Text style={styles.stripText}>{detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    paddingVertical: space.sm,
    paddingHorizontal: space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  stripInfo: { backgroundColor: colors.surface2 },
  stripWarn: { backgroundColor: "rgba(255,226,173,0.12)" },
  stripText: {
    color: colors.muted,
    fontSize: type.small,
  },
  stripTextStrong: {
    color: colors.warning,
    fontSize: type.small,
    fontWeight: "600",
    marginBottom: 2,
  },
});
