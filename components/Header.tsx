import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "./ThemedText";

interface HeaderProps {
    balance: number | undefined;
    onBalancePress: () => void;
}

export const Header: React.FC<HeaderProps> = ({ balance, onBalancePress }) => {
    const backgroundColor = useThemeColor({}, "primary");

    return (
        <View style={styles.header}>
            <View>
                <Image source={require("@/assets/images/logo.png")} resizeMode="contain" style={styles.logo} />
            </View>
            <ThemedText style={styles.headerTitle}>CWS</ThemedText>
            <TouchableOpacity style={[styles.balanceContainer, { backgroundColor }]} onPress={onBalancePress}>
                <ThemedText style={styles.balanceText}>Pts: {balance?.toFixed(2) ?? "---"}</ThemedText>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        height: 70,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0"
    },
    logo: {
        width: 35,
        height: 35,
        backgroundSize: "contain",
        marginRight: 8
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold"
    },
    balanceContainer: {
        marginLeft: "auto",
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 12
    },
    balanceText: {
        color: "white",
        fontWeight: "bold"
    }
});
