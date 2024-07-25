import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet } from "react-native";
import WithdrawalStatusBadge from "./WithdrawalStatusBadge";

interface WithdrawalHistoryItemProps {
  withdrawal: {
    id: number;
    amount: number;
    status: string;
    created_at: string;
  };
}

const WithdrawalHistoryItem: React.FC<WithdrawalHistoryItemProps> = ({
  withdrawal,
}) => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText>Amount: ₵{withdrawal.amount.toFixed(2)}</ThemedText>
      <WithdrawalStatusBadge status={withdrawal.status} />
      <ThemedText>
        Date: {new Date(withdrawal.created_at).toLocaleDateString()}
      </ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
});

export default WithdrawalHistoryItem;
