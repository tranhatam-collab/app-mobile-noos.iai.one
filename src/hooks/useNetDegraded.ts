import { useState } from "react";

/**
 * Placeholder: gắn @react-native-community/netinfo khi có API / sync thật.
 */
export function useNetDegraded(): { offline: boolean; label: string } {
  const [offline] = useState(false);
  const label = offline
    ? "Chế độ cục bộ (demo)"
    : "Đồng bộ: chờ backend";
  return { offline, label };
}
