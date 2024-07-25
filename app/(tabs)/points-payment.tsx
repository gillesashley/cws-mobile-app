import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, StyleSheet, View, Alert, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/Button";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthContext } from "@/components/AuthProvider";
import WithdrawalForm from "@/components/points-payments/WithdrawalForm";
import { fetchPointsData, submitWithdrawalRequest, PointsData } from "@/services/services";

export default function PointsPaymentScreen() {
  const [pointsData, setPointsData] = useState<PointsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);

  const { token } = useAuthContext();
  const backgroundColor = useThemeColor({}, "background");

  const fetchData = useCallback(async () => {
    if (!token) {
      Alert.alert("Error", "You must be logged in to view this page");
      return;
    }

    try {
      setIsLoading(true);
      const data = await fetchPointsData(token);
      setPointsData(data);
    } catch (error) {
      console.error("Error fetching points data:", error);
      Alert.alert("Error", "Failed to load points data");
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const handleWithdrawalRequest = async (amount: number) => {
    if (!token) {
      Alert.alert("Error", "You must be logged in to make a withdrawal");
      return;
    }

    try {
      await submitWithdrawalRequest(token, amount);
      Alert.alert("Success", "Withdrawal request submitted successfully");
      setShowWithdrawalForm(false);
      fetchData(); // Refresh data after successful request
    } catch (error) {
      console.error("Error submitting withdrawal request:", error);
      Alert.alert("Error", "Failed to submit withdrawal request");
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <ThemedText>Loading...</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]} edges={["top"]}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ThemedView style={styles.content}>
          <ThemedText type="title">Points & Payments</ThemedText>

          <ThemedView style={styles.pointsContainer}>
            <ThemedText type="subtitle">Your Points</ThemedText>
            <ThemedText style={styles.pointsValue}>{pointsData?.balance ?? 0}</ThemedText>
            <ThemedText>Equivalent to: ₵{((pointsData?.balance ?? 0) / 50).toFixed(2)}</ThemedText>
          </ThemedView>

          {!showWithdrawalForm && (
            <Button
              title="Request Withdrawal"
              onPress={() => setShowWithdrawalForm(true)}
              style={styles.withdrawButton}
            />
          )}

          {showWithdrawalForm && (
            <WithdrawalForm
              onSubmit={handleWithdrawalRequest}
              onCancel={() => setShowWithdrawalForm(false)}
              maxAmount={(pointsData?.balance ?? 0) / 50}
            />
          )}

          <ThemedView style={styles.historyContainer}>
            <ThemedText type="subtitle">Withdrawal History</ThemedText>
            {pointsData?.withdrawalHistory.map((withdrawal) => (
              <ThemedView key={withdrawal.id} style={styles.historyItem}>
                <ThemedText>Amount: ₵{withdrawal.amount.toFixed(2)}</ThemedText>
                <ThemedText>Status: {withdrawal.status}</ThemedText>
                <ThemedText>Date: {new Date(withdrawal.created_at).toLocaleDateString()}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  pointsContainer: {
    marginVertical: 16,
    alignItems: "center",
  },
  pointsValue: {
    fontSize: 48,
    fontWeight: "bold",
    marginVertical: 8,
  },
  withdrawButton: {
    marginBottom: 16,
  },
  historyContainer: {
    marginTop: 24,
  },
  historyItem: {
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
});