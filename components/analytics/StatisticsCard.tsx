import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

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
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>
      <Text style={[styles.value, { color: textColor }]}>{value.toLocaleString()}</Text>
      <View style={styles.changeContainer}>
        <Text style={[styles.changeText, { color: changeColor }]}>
          {changeIcon} {Math.abs(change).toFixed(2)}%
        </Text>
        <Text style={[styles.periodText, { color: textColor }]}>than last week</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 14,
    marginBottom: 8,
  },
  value: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
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
  },
});