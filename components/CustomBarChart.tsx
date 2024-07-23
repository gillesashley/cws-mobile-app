import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from "@/hooks/useThemeColor";

interface BarChartProps {
  data: number[];
  labels: string[];
}

export const CustomBarChart: React.FC<BarChartProps> = ({ data, labels }) => {
  const maxValue = Math.max(...data);
  const barColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

  return (
    <View style={styles.container}>
      {data.map((value, index) => (
        <View key={index} style={styles.barContainer}>
          <View style={[styles.bar, { height: `${(value / maxValue) * 100}%`, backgroundColor: barColor }]} />
          <Text style={[styles.label, { color: textColor }]}>{labels[index]}</Text>
          <Text style={[styles.value, { color: textColor }]}>{value}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 200,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginVertical: 20,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: '50%',
  },
  label: {
    marginTop: 5,
    fontSize: 12,
  },
  value: {
    fontSize: 10,
    marginTop: 2,
  },
});