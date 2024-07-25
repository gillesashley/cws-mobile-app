import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

interface PointsBalanceProps {
  balance: number;
}

const PointsBalance: React.FC<PointsBalanceProps> = ({ balance }) => {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Your Points</ThemedText>
      <ThemedText style={styles.pointsValue}>{balance}</ThemedText>
      <ThemedText>Equivalent to: ₵{(balance / 50).toFixed(2)}</ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    alignItems: 'center',
  },
  pointsValue: {
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 8,
  },
});

export default PointsBalance;