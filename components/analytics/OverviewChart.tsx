import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";

interface OverviewChartProps {
  data: {
    labels: string[];
    datasets: {
      data: number[];
      color: (opacity: number) => string;
      strokeWidth: number;
    }[];
  };
}

export const OverviewChart: React.FC<OverviewChartProps> = ({ data }) => {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  if (data.datasets[0].data.length === 0) {
    return (
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <ThemedText style={styles.title}>Overview</ThemedText>
        <ThemedText>No data available for the overview chart.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ThemedText style={styles.title}>Overview</ThemedText>
      <LineChart
        data={data}
        width={Dimensions.get("window").width - 32}
        height={220}
        chartConfig={{
          backgroundColor: backgroundColor,
          backgroundGradientFrom: backgroundColor,
          backgroundGradientTo: backgroundColor,
          decimalPlaces: 0,
          color: (opacity = 1) => textColor,
          labelColor: (opacity = 1) => textColor,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: "6",
            strokeWidth: "2",
            stroke: textColor,
          },
        }}
        bezier
        style={styles.chart}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
