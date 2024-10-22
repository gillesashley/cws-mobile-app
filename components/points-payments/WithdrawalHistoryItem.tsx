import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import WithdrawalStatusBadge from "./WithdrawalStatusBadge";

interface WithdrawalHistoryItemProps {
    withdrawal: {
        id: number;
        amount: number;
        status: string;
        created_at: string;
    };
}

const WithdrawalHistoryItem: React.FC<WithdrawalHistoryItemProps> = ({ withdrawal }) => {
    const backgroundColor = useThemeColor({}, "surface");
    const textColor = useThemeColor({}, "text");
    const accentColor = useThemeColor({}, "accent");

    return (
        <ThemedView style={[styles.container, { backgroundColor }]}>
            <View style={styles.iconContainer}>
                <FontAwesome5 name="money-bill-wave" size={24} color={accentColor} />
            </View>
            <View style={styles.contentContainer}>
                <View style={styles.topRow}>
                    <ThemedText style={styles.amount}>₵{withdrawal.amount.toFixed(2)}</ThemedText>
                    <WithdrawalStatusBadge status={withdrawal.status} />
                </View>
                <ThemedText style={[styles.date, { color: textColor }]}>
                    {new Date(withdrawal.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </ThemedText>
            </View>
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        marginRight: 16,
    },
    contentContainer: {
        flex: 1,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    amount: {
        fontSize: 18,
        fontWeight: "bold",
    },
    date: {
        fontSize: 14,
        opacity: 0.7,
    },
});

export default WithdrawalHistoryItem;
