import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface StatisticCardProps {
  title: string;
  value: number;
  change: number;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  change,
}) => {
  const isPositive = change >= 0;
  const changeColor = isPositive ? "#4CAF50" : "#F44336";
  const changeIcon = isPositive ? "▲" : "▼";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value.toLocaleString()}</Text>
      <View style={styles.changeContainer}>
        <Text style={[styles.changeText, { color: changeColor }]}>
          {changeIcon} {Math.abs(change).toFixed(2)}%
        </Text>
        <Text style={styles.periodText}>than last week</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  changeText: {
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 4,
  },
  periodText: {
    fontSize: 12,
    color: "#666",
  },
});
