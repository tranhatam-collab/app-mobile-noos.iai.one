import { FlatList, View, Text, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { ModuleCard } from "../components/ModuleCard";
import { NOOS_MODULES } from "../data/modules";
import type { NoosModuleId } from "../types/noos";
import type { ModulesStackParamList } from "../navigation/types";
import { colors, space, type } from "../theme/tokens";

type Nav = NativeStackNavigationProp<ModulesStackParamList, "ModulesList">;

export function ModulesScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.kicker}>Khối chức năng</Text>
        <Text style={styles.title}>Module</Text>
        <Text style={styles.sub}>
          Chạm để xem mô tả engine — UI đầy đủ theo từng phase triển khai.
        </Text>
      </View>
      <FlatList
        data={NOOS_MODULES}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ModuleCard
            module={item}
            onPress={() =>
              navigation.navigate("ModuleDetail", {
                moduleId: item.id as NoosModuleId,
              })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: space.md, paddingBottom: space.sm },
  kicker: {
    color: colors.accent,
    fontSize: type.micro,
    letterSpacing: 1.2,
    textTransform: "uppercase",
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
});
