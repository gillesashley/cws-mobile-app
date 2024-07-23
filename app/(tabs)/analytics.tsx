import React from "react";
import { Dimensions, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

const screenWidth = Dimensions.get("window").width;

export default function AnalyticsScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={["top"]}
    >
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.content}>
          <ThemedText type="title">Analytics Dashboard</ThemedText>

          <ThemedView style={styles.metricsContainer}>
            <ThemedText type="subtitle">Key Metrics</ThemedText>
            <ThemedText>Daily Active Users: 1,234</ThemedText>
            <ThemedText>Total Engagements: 1,359</ThemedText>
            <ThemedText>Conversion Rate: 2.3%</ThemedText>
          </ThemedView>

          <ThemedView style={styles.performanceContainer}>
            <ThemedText type="subtitle">Campaign Performance</ThemedText>
            <ThemedText>Top Performing Campaign: "Education Reform"</ThemedText>
            <ThemedText>Reach: 10,000 users</ThemedText>
            <ThemedText>Engagement Rate: 5.7%</ThemedText>
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
  chartContainer: {
    marginVertical: 16,
    alignItems: "center",
  },
  pieContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  legend: {
    marginTop: 20,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
  },
  metricsContainer: {
    marginVertical: 16,
  },
  performanceContainer: {
    marginVertical: 16,
  },
});
