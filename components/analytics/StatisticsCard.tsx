import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.45; // Assuming two cards per row with some spacing

interface StatisticCardProps {
    title: string;
    value: number;
    change: number;
    icon: string;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({ title, value, change, icon }) => {
    const isPositive = change >= 0;
    const changeColor = isPositive ? "#4CAF50" : "#F44336";
    const changeIcon = isPositive ? "arrow-up" : "arrow-down";
    const backgroundColor = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");
    const primaryColor = useThemeColor({}, "primary");

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <LinearGradient colors={[primaryColor, backgroundColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientOverlay} />
            <View style={styles.iconContainer}>
                <FontAwesome5 name={icon} size={24} color={textColor} />
            </View>
            <ThemedText style={styles.title}>{title}</ThemedText>
            <ThemedText style={styles.value}>{value.toLocaleString()}</ThemedText>
            <View style={styles.changeContainer}>
                <FontAwesome5 name={changeIcon} size={12} color={changeColor} />
                <ThemedText style={[styles.changeText, { color: changeColor }]}> {Math.abs(change).toFixed(2)}%</ThemedText>
            </View>
            <ThemedText style={styles.periodText}>than last week</ThemedText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        marginRight: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        overflow: "hidden",
    },
    gradientOverlay: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: "100%",
        opacity: 0.1,
    },
    iconContainer: {
        marginBottom: 12,
    },
    title: {
        fontSize: 14,
        opacity: 0.8,
        marginBottom: 8,
    },
    value: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 12,
    },
    changeContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    changeText: {
        fontSize: 12,
        fontWeight: "bold",
    },
    periodText: {
        fontSize: 10,
        opacity: 0.6,
    },
});
