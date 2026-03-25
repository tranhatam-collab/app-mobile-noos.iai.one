import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Keyboard,
} from "react-native";
import { colors, radius, space, type } from "../theme/tokens";

type Props = {
  onSubmit?: (text: string) => void;
};

export function AskNoosInput({ onSubmit }: Props) {
  const [value, setValue] = useState("");

  const submit = () => {
    const t = value.trim();
    if (!t) return;
    onSubmit?.(t);
    setValue("");
    Keyboard.dismiss();
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Hỏi NOOS…</Text>
      <View style={styles.row}>
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder="Ý nghĩa · ý định · bước tiếp theo"
          placeholderTextColor={colors.muted2}
          style={styles.input}
          multiline
          maxLength={2000}
          returnKeyType="send"
          onSubmitEditing={submit}
          blurOnSubmit
        />
        <Pressable
          onPress={submit}
          style={({ pressed }) => [
            styles.send,
            pressed && styles.sendPressed,
            !value.trim() && styles.sendDisabled,
          ]}
          disabled={!value.trim()}
        >
          <Text style={styles.sendText}>→</Text>
        </Pressable>
      </View>
      <Text style={styles.hint}>
        Giai đoạn shell: parse / flow / consent sẽ nối API sau khi bạn duyệt
        contract.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.line,
    padding: space.md,
  },
  label: {
    color: colors.accent,
    fontSize: type.micro,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: space.sm,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: space.sm,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    color: colors.text,
    fontSize: type.body,
    paddingVertical: space.sm,
    paddingHorizontal: space.sm,
    backgroundColor: colors.surface2,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.line,
  },
  send: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.accent2,
    alignItems: "center",
    justifyContent: "center",
  },
  sendPressed: { opacity: 0.85 },
  sendDisabled: { opacity: 0.35 },
  sendText: {
    color: colors.bg,
    fontSize: 20,
    fontWeight: "700",
  },
  hint: {
    marginTop: space.sm,
    color: colors.muted2,
    fontSize: type.micro,
    lineHeight: 16,
  },
});
