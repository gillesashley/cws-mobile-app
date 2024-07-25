import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { StyleSheet, View } from "react-native";

interface PointsBalanceProps {
  balance: number;
}

const PointsBalance: React.FC<PointsBalanceProps> = ({ balance }) => {
  return (
    <ThemedView style={styles.container}>
      <View style={styles.balanceContainer}>
        <ThemedText type="subtitle" weight="bold" style={styles.label}>
          Your Points
        </ThemedText>
        <ThemedText type="default" weight="bold" style={styles.pointsValue}>
          {balance}
        </ThemedText>
      </View>
      <ThemedText
        type="default"
        fontStyle="italic"
        style={styles.equivalentText}
      >
        Equivalent to: ₵{(balance / 50).toFixed(2)}
      </ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceContainer: {
    alignItems: "center",
    marginBottom: 8,
    paddingVertical: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 48,
    marginVertical: 8,
  },
  equivalentText: {
    fontSize: 16,
    color: "#888",
  },
});

export default PointsBalance;
