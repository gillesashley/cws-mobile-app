import React from "react";
import { ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/Button";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PointsPaymentScreen() {
  const backgroundColor = useThemeColor({}, "background");
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={["top"]}
    >
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.container}>
          <ThemedText type="title">Points & Payments</ThemedText>

          <ThemedView style={styles.pointsContainer}>
            <ThemedText type="subtitle">Your Points</ThemedText>
            <ThemedText>500 Points</ThemedText>
            <ThemedText style={styles.pointsValue}>1,250</ThemedText>
            <ThemedText>Equivalent to: ₵25.00</ThemedText>
          </ThemedView>

          <ThemedView style={styles.activityContainer}>
            <ThemedText type="subtitle">Recent Activity</ThemedText>
            <ThemedText>+10 points - Shared campaign message</ThemedText>
            <ThemedText>+5 points - Liked a post</ThemedText>
            <ThemedText>+2 points - Read campaign update</ThemedText>
          </ThemedView>

          <ThemedView style={styles.withdrawContainer}>
            <ThemedText type="subtitle">Withdraw Funds</ThemedText>
            <Button
              title="Request Withdrawal"
              onPress={() => console.log("Withdraw pressed")}
            />
            <ThemedText style={styles.withdrawalNote}>
              Minimum withdrawal: ₵10.00 (500 points)
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
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
  activityContainer: {
    marginVertical: 16,
  },
  withdrawContainer: {
    marginVertical: 16,
    alignItems: "center",
  },
  withdrawalNote: {
    marginTop: 8,
    fontStyle: "italic",
  },
});
