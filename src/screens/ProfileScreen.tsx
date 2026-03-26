import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radius, space, type } from "../theme/tokens";
import { useNoosSession } from "../state/NoosSessionProvider";

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const {
    currentIntent,
    consentChain,
    evidenceRecords,
    approveCurrentIntent,
    rejectCurrentIntent,
    rollbackCurrentIntent,
    status,
    error,
    clear,
  } = useNoosSession();

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.scroll,
        { paddingTop: insets.top + space.md, paddingBottom: insets.bottom + 32 },
      ]}
    >
      <Text style={styles.kicker}>Consent · Trust · Evidence</Text>
      <Text style={styles.title}>Trung tâm quyền & bằng chứng</Text>
      <Text style={styles.lead}>
        Mọi quyết định runtime cần evidence chain. Các nút dưới đây gọi contract intent
        (approve/reject/rollback).
      </Text>

      {status === "error" && error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Current intent</Text>
        <Text style={styles.panelBody}>
          {currentIntent ? (
            <>
              <Text style={styles.monoText}>id: {currentIntent.id}</Text>
              {"\n"}
              <Text style={styles.monoText}>approvalState: {currentIntent.approvalState}</Text>
              {"\n"}
              <Text style={styles.monoText}>targetTwinId: {currentIntent.targetTwinId}</Text>
            </>
          ) : (
            "— Chưa có intent nào được tạo. Vào Home để “Ask NOOS…”."
          )}
        </Text>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Consent gate</Text>
        <Text style={styles.panelBody}>
          {currentIntent ? (
            <>
              <Text style={styles.monoText}>
                humanRequired: {String(consentChain?.humanRequired ?? false)}
              </Text>
              {"\n"}
              <Text style={styles.monoText}>
                rightToDisconnect: {String(consentChain?.rightToDisconnect ?? true)}
              </Text>
              {"\n"}
              <Text style={styles.monoText}>
                bciVetoRequired: {String(consentChain?.bciVetoRequired ?? true)}
              </Text>
            </>
          ) : (
            "—"
          )}
        </Text>

        <View style={styles.actions}>
          <Pressable
            disabled={!currentIntent}
            onPress={() => void approveCurrentIntent()}
            style={({ pressed }) => [styles.btn, styles.btnPrimary, pressed && styles.btnPressed]}
          >
            <Text style={styles.btnText}>Approve (Human consent)</Text>
          </Pressable>

          <Pressable
            disabled={!currentIntent}
            onPress={() => void rejectCurrentIntent()}
            style={({ pressed }) => [styles.btn, styles.btnDanger, pressed && styles.btnPressed]}
          >
            <Text style={styles.btnText}>Reject (Veto)</Text>
          </Pressable>

          <Pressable
            disabled={!currentIntent}
            onPress={() => void rollbackCurrentIntent()}
            style={({ pressed }) => [styles.btn, styles.btnGhost, pressed && styles.btnPressed]}
          >
            <Text style={styles.btnText}>Rollback</Text>
          </Pressable>
        </View>

        <View style={styles.actions}>
          <Pressable
            disabled={!currentIntent}
            onPress={() => clear()}
            style={({ pressed }) => [styles.btn, styles.btnGhost, pressed && styles.btnPressed]}
          >
            <Text style={styles.btnText}>Clear local session</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.panel}>
        <Text style={styles.panelTitle}>Evidence center</Text>
        {evidenceRecords.length ? (
          <View style={{ marginTop: space.sm }}>
            {evidenceRecords.slice(0, 10).map((ev) => (
              <View key={ev.id} style={styles.evRow}>
                <View style={styles.evDot} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.evClaim} numberOfLines={3}>
                    {ev.claim}
                  </Text>
                  <Text style={styles.evMeta}>id: {ev.id}</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.panelBody}>— Chưa có evidence. Vào Home để tạo intent.</Text>
        )}
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
  errorText: {
    color: colors.danger,
    fontSize: type.small,
    marginBottom: space.sm,
    marginHorizontal: space.md,
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
  monoText: {
    fontFamily: "monospace",
    color: colors.muted2,
    fontSize: type.micro,
    lineHeight: 18,
  },
  actions: {
    marginTop: space.md,
    gap: space.sm,
  },
  btn: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  btnPrimary: {
    backgroundColor: "rgba(127,211,255,0.10)",
    borderColor: "rgba(127,211,255,0.28)",
  },
  btnDanger: {
    backgroundColor: "rgba(255,210,216,0.08)",
    borderColor: "rgba(255,210,216,0.25)",
  },
  btnGhost: { backgroundColor: "rgba(255,255,255,0.02)" },
  btnPressed: { opacity: 0.9 },
  btnText: {
    color: colors.text,
    textAlign: "center",
    fontWeight: "700",
    fontSize: type.small,
  },
  evRow: {
    flexDirection: "row",
    gap: space.sm,
    paddingVertical: space.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: colors.line,
  },
  evDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent2,
    marginTop: 6,
  },
  evClaim: {
    color: colors.text,
    fontSize: type.small,
    fontWeight: "600",
    lineHeight: 18,
  },
  evMeta: {
    color: colors.muted2,
    fontSize: type.micro,
    marginTop: 6,
  },
});
