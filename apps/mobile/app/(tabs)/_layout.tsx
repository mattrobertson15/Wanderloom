import { Tabs } from "expo-router";
import { Text } from "react-native";
import { colors } from "@wanderloom/config";

const TAB_ICONS: Record<string, string> = {
  globe: "🌐",
  trips: "🧳",
  create: "➕",
  discover: "🔍",
  profile: "👤",
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.accent.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarIcon: () => <Text>{TAB_ICONS[route.name] ?? "•"}</Text>,
      })}
    >
      <Tabs.Screen name="globe" options={{ title: "Globe" }} />
      <Tabs.Screen name="trips" options={{ title: "Trips" }} />
      <Tabs.Screen name="create" options={{ title: "Create" }} />
      <Tabs.Screen name="discover" options={{ title: "Discover" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
