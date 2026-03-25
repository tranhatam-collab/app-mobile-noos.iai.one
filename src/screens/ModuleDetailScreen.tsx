import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { NOOS_MODULES } from "../data/modules";
import type { ModulesStackParamList } from "../navigation/types";
import { colors, radius, space, type } from "../theme/tokens";

type Props = NativeStackScreenProps<ModulesStackParamList, "ModuleDetail">;

export function ModuleDetailScreen({ route }: Props) {
  const insets = useSafeAreaInsets();
  const mod = NOOS_MODULES.find((m) => m.id === route.params.moduleId);

  if (!mod) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <Text style={styles.error}>Không tìm thấy module.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.scroll,
        { paddingTop: insets.top + space.md, paddingBottom: insets.bottom + 24 },
      ]}
    >
      <Text style={styles.icon}>{mod.icon}</Text>
      <Text style={styles.title}>{mod.title}</Text>
      <Text style={styles.sub}>{mod.subtitle}</Text>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Engine placeholder</Text>
        <Text style={styles.panelBody}>
          Module này bám NOOS_CODEBASE_BOOTSTRAP: object phải có MeaningID,
          Intent, ConsentChain, EvidenceRecord. Khi bạn duyệt API contract, màn
          hình này sẽ gọi worker tương ứng và hiển thị degraded mode nếu mất
          mạng.
        </Text>
      </View>
      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Quyền con người</Text>
        <Text style={styles.panelBody}>
          Veto · disconnect · override luôn hiển thị ở phase sau; shell hiện tại
          chỉ cố định bố cục an toàn cho touch & safe area.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingHorizontal: space.md },
  error: { color: colors.danger, padding: space.md },
  icon: {
    fontSize: 40,
    color: colors.accent,
    marginBottom: space.sm,
  },
  title: {
    color: colors.text,
    fontSize: type.title,
    fontWeight: "700",
  },
  sub: {
    color: colors.muted,
    fontSize: type.body,
    marginTop: space.sm,
    lineHeight: 22,
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
    color: colors.accent3,
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
