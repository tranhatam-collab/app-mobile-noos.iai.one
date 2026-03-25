import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { colors, radius, space, type } from "../theme/tokens";

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const version = Constants.expoConfig?.version ?? "0.1.0";

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.scroll,
        { paddingTop: insets.top + space.md, paddingBottom: insets.bottom + 32 },
      ]}
    >
      <Text style={styles.kicker}>Chủ quyền</Text>
      <Text style={styles.title}>Hồ sơ & quyền</Text>
      <Text style={styles.lead}>
        Human sovereignty: veto, ngắt kết nối, ghi đè — sẽ có nút hành động
        rõ ràng khi consent API hoàn tất.
      </Text>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Phiên bản app</Text>
        <Text style={styles.rowValue}>{version}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.rowLabel}>Consent đang hoạt động</Text>
        <Text style={styles.rowValue}>— (stub)</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.rowLabel}>Evidence export</Text>
        <Text style={styles.rowValue}>Chưa kết nối</Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Audit trail</Text>
        <Text style={styles.panelBody}>
          Mọi thay đổi quan trọng sẽ ghi vào evidence có cấu trúc; app mobile chỉ
          là một surface — worker/D1 là nguồn sự thật.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: space.md },
  kicker: {
    color: colors.accent,
    fontSize: type.micro,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  title: {
    color: colors.text,
    fontSize: type.title,
    fontWeight: "700",
    marginTop: space.xs,
  },
  lead: {
    color: colors.muted,
    fontSize: type.body,
    lineHeight: 22,
    marginTop: space.md,
    marginBottom: space.lg,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: space.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  rowLabel: { color: colors.muted, fontSize: type.body, flex: 1 },
  rowValue: {
    color: colors.text,
    fontSize: type.small,
    fontWeight: "500",
    maxWidth: "50%",
    textAlign: "right",
  },
  panel: {
    marginTop: space.lg,
    padding: space.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
  },
  panelTitle: {
    color: colors.gold,
    fontSize: type.small,
    fontWeight: "600",
    marginBottom: space.sm,
  },
  panelBody: {
    color: colors.muted,
    fontSize: type.small,
    lineHeight: 20,
  },
});
