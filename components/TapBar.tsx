import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

const tabs = [
  { name: "Home", icon: "home", route: "/" },
  { name: "Analytics", icon: "bar-chart", route: "/analytics" },
  { name: "Points", icon: "cash", route: "/points-payment" },
  { name: "Profile", icon: "person", route: "/profile" },
  { name: "Help", icon: "help-circle", route: "/help" },
];

export function TabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const activeColor = useThemeColor({}, "tint");

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={styles.tab}
          onPress={() => router.push(tab.route)}
        >
          <Ionicons
            name={tab.icon as any}
            size={24}
            color={pathname === tab.route ? activeColor : textColor}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    height: 60,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});