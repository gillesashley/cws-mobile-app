import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthContext, WhenAuthed } from "@/components/AuthProvider";

export default function TabLayout() {
    // const colorScheme = useColorScheme();
    const colorScheme = "light";
    const backgroundColor = useThemeColor({}, "background");
    const { token, user, logout } = useAuthContext();

    React.useEffect(() => {
        console.log("Tab Layout mounted");
        console.log(`Token from tab layout page ${token}`);
        return () => console.log("Tab Layout unmounted");
    }, []);

    return (
        <WhenAuthed>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: Colors[colorScheme].tint,
                    tabBarStyle: {
                        backgroundColor,
                        // Add bottom padding for iOS to account for home indicator
                        paddingBottom: Platform.OS === "ios" ? 4 : 0,
                        height: Platform.OS === "ios" ? 88 : 58
                    },
                    tabBarItemStyle: {
                        // Add top padding to lift icons a bit on iOS
                        paddingTop: Platform.OS === "ios" ? 8 : 0
                    }
                }}>
                <Tabs.Screen
                    name="home"
                    options={{
                        title: "Home",
                        tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "home" : "home-outline"} color={color} />
                    }}
                />
                <Tabs.Screen
                    name="analytics"
                    options={{
                        title: "Analytics",
                        tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "bar-chart" : "bar-chart-outline"} color={color} />
                    }}
                />
                <Tabs.Screen
                    name="points-payment"
                    options={{
                        title: "Points",
                        tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "cash" : "cash-outline"} color={color} />
                    }}
                    listeners={{
                        tabPress: (e) => {
                            console.log("Analytics tab pressed");
                        }
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: "Profile",
                        tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "person" : "person-outline"} color={color} />
                    }}
                />
                <Tabs.Screen
                    name="help"
                    options={{
                        title: "help",
                        tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? "help" : "help-outline"} color={color} />
                    }}
                />
            </Tabs>
        </WhenAuthed>
    );
}
