import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, StyleSheet, Alert, RefreshControl, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/Button";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuthContext } from "@/components/AuthProvider";
import WithdrawalForm from "@/components/points-payments/WithdrawalForm";
import PointsBalance from "@/components/points-payments/PointBalance";
import WithdrawalHistory from "@/components/points-payments/WithdrawalHistory";
import { fetchPointsData, submitWithdrawalRequest, PointsData } from "@/services/services";

export default function PointsPaymentScreen() {
  const [pointsData, setPointsData] = useState<PointsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuthContext();
  const backgroundColor = useThemeColor({}, "background");

  const fetchData = useCallback(async () => {
    if (!token) {
      setError("You must be logged in to view this page");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchPointsData(token);
      setPointsData(data);
    } catch (error) {
      console.error("Error fetching points data:", error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
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
      setError("You must be logged in to make a withdrawal");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await submitWithdrawalRequest(token, amount);
      Alert.alert("Success", "Withdrawal request submitted successfully");
      setShowWithdrawalForm(false);
      fetchData(); // Refresh data after successful request
    } catch (error) {
      console.error("Error submitting withdrawal request:", error);
      if (error instanceof Error) {
        setError(`Failed to submit withdrawal request: ${error.message}`);
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <ActivityIndicator size="large" color={useThemeColor({}, "text")} />
      </SafeAreaView>
    );
  }

  if (error && error.includes("Points feature is not available")) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <ThemedView style={styles.content}>
          <ThemedText type="title">Points & Payments</ThemedText>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
          <ThemedText>We're working on bringing this feature to you soon. Please check back later.</ThemedText>
        </ThemedView>
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

          {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

          {pointsData && <PointsBalance balance={pointsData.balance} />}

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
              isSubmitting={isSubmitting}
            />
          )}

          {pointsData && <WithdrawalHistory withdrawals={pointsData.withdrawalHistory} />}
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
  withdrawButton: {
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 16,
  },
});