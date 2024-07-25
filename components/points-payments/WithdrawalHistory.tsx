import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { FlatList, StyleSheet } from "react-native";
import WithdrawalStatusBadge from "./WithdrawalStatusBadge";

interface WithdrawalHistoryProps {
  withdrawals: Array<{
    id: number;
    amount: number;
    status: string;
    created_at: string;
  }>;
}

const WithdrawalHistory: React.FC<WithdrawalHistoryProps> = ({
  withdrawals,
}) => {
  const renderWithdrawalItem = ({
    item,
  }: {
    item: WithdrawalHistoryProps["withdrawals"][0];
  }) => (
    <ThemedView style={styles.historyItem}>
      <ThemedText>Amount: ₵{item.amount.toFixed(2)}</ThemedText>
      <WithdrawalStatusBadge status={item.status} />
      <ThemedText>
        Date: {new Date(item.created_at).toLocaleDateString()}
      </ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Withdrawal History</ThemedText>
      <FlatList
        data={withdrawals}
        renderItem={renderWithdrawalItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<ThemedText>No withdrawal history</ThemedText>}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
  },
  historyItem: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
});

export default WithdrawalHistory;
