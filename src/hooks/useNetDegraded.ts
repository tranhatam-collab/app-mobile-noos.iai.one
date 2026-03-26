import { useMemo } from "react";
import Constants from "expo-constants";

/**
 * Placeholder: gắn @react-native-community/netinfo khi có API / sync thật.
 */
export function useNetDegraded(): { offline: boolean; label: string } {
  const offline = useMemo(() => {
    const extra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;
    const v = extra.NOOS_FORCE_OFFLINE;
    return v === true || v === "true" || v === "1";
  }, []);

  const label = offline ? "Chế độ cục bộ (offline mode)" : "Đồng bộ: chờ backend";
  return { offline, label };
}
