import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

interface UserEngagementData {
  dailyActiveUsers: number;
  totalEngagements: number;
  conversionRate: number;
  totalLikes: number;
  totalShares: number;
  totalReads: number;
}

interface UserEngagementMetricsProps {
  data: UserEngagementData;
}

export const UserEngagementMetrics: React.FC<UserEngagementMetricsProps> = ({
  data,
}) => {
  const chartData = {
    labels: ["Likes", "Shares", "Reads"],
    datasets: [
      {
        data: [data.totalLikes, data.totalShares, data.totalReads],
      },
    ],
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">User Engagement</ThemedText>
      <View style={styles.metricsContainer}>
        <ThemedText>Daily Active Users: {data.dailyActiveUsers}</ThemedText>
        <ThemedText>Total Engagements: {data.totalEngagements}</ThemedText>
        <ThemedText>Conversion Rate: {data.conversionRate}%</ThemedText>
      </View>
      <BarChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
        yAxisLabel=""
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  metricsContainer: {
    marginVertical: 8,
  },
});
