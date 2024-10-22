import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

interface PointsBalanceProps {
    balance: number;
}

const PointsBalance: React.FC<PointsBalanceProps> = ({ balance }) => {
    const textColor = useThemeColor({}, "background"); // Using background color for text to ensure contrast
    const iconColor = useThemeColor({}, "background");

    const animation = useSharedValue(0);

    useEffect(() => {
        animation.value = withSpring(1, { damping: 12, stiffness: 90 });
    }, []);

    const containerStyle = useAnimatedStyle(() => ({
        opacity: animation.value,
        transform: [{ translateY: (1 - animation.value) * 20 }],
    }));

    return (
        <Animated.View style={[styles.container, containerStyle]}>
            <LinearGradient colors={["#0200FF", "#3b5998", "#D0041D"]} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                <View style={styles.iconContainer}>
                    <Ionicons name="wallet-outline" size={32} color={iconColor} />
                </View>
                <View style={styles.contentContainer}>
                    <ThemedText type="subtitle" weight="bold" style={[styles.label, { color: textColor }]}>
                        Your Points Balance
                    </ThemedText>
                    <ThemedText type="default" weight="bold" style={[styles.pointsValue, { color: textColor }]}>
                        {balance} points
                    </ThemedText>
                    <ThemedText type="default" style={[styles.equivalentText, { color: textColor }]}>
                        Equivalent to: ₵{(balance / 50).toFixed(2)}
                    </ThemedText>
                </View>
            </LinearGradient>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
        borderRadius: 12,
        overflow: "hidden", // Ensures the gradient doesn't spill outside rounded corners
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    gradient: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
    },
    iconContainer: {
        marginRight: 20,
    },
    contentContainer: {
        flex: 1,
    },
    label: {
        fontSize: 16,
        marginBottom: 6,
    },
    pointsValue: {
        fontSize: 24,
        marginVertical: 10,
    },
    equivalentText: {
        fontSize: 14,
        fontWeight: "bold",
        fontStyle: "italic",
        marginTop: 4,
    },
});

export default PointsBalance;
