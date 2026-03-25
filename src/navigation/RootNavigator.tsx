import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { HomeScreen } from "../screens/HomeScreen";
import { ModulesScreen } from "../screens/ModulesScreen";
import { ModuleDetailScreen } from "../screens/ModuleDetailScreen";
import { FlowsScreen } from "../screens/FlowsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { NOOS_MODULES } from "../data/modules";
import { colors } from "../theme/tokens";
import type { ModulesStackParamList, RootTabParamList } from "./types";

const navTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.accent,
    background: colors.bg,
    card: colors.surface,
    text: colors.text,
    border: colors.line,
    notification: colors.accent2,
  },
};

const Stack = createNativeStackNavigator<ModulesStackParamList>();
const Tab = createBottomTabNavigator<RootTabParamList>();

function ModulesStackScreen() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "600" },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      <Stack.Screen
        name="ModulesList"
        component={ModulesScreen}
        options={{ title: "Module" }}
      />
      <Stack.Screen
        name="ModuleDetail"
        component={ModuleDetailScreen}
        options={({ route }) => {
          const m = NOOS_MODULES.find((x) => x.id === route.params.moduleId);
          return { title: m?.title ?? "Chi tiết" };
        }}
      />
    </Stack.Navigator>
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Tab.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "600" },
          headerShadowVisible: false,
          tabBarStyle: {
            backgroundColor: colors.surface,
            borderTopColor: colors.line,
          },
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.muted2,
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "Trang chủ",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Modules"
          component={ModulesStackScreen}
          options={{
            headerShown: false,
            title: "Module",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="grid-outline" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Flows"
          component={FlowsScreen}
          options={{
            title: "Flow",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="git-branch-outline" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: "Hồ sơ",
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-circle-outline" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
