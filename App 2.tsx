import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { NoosSessionProvider } from "./src/state/NoosSessionProvider";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NoosSessionProvider>
        <RootNavigator />
      </NoosSessionProvider>
    </SafeAreaProvider>
  );
}
