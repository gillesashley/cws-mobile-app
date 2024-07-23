import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from "@/hooks/useThemeColor";

interface PieChartData {
  value: number;
  color: string;
  label: string;
}

interface PieChartProps {
  data: PieChartData[];
  size: number;
}

const PieChartSlice: React.FC<{
  percentage: number;
  color: string;
  rotation: number;
  size: number;
}> = ({ percentage, color, rotation, size }) => {
  return (
    <View
      style={[
        styles.slice,
        {
          width: size,
          height: size,
          transform: [
            { rotate: `${rotation}deg` },
            { translateX: size / 4 },
            { translateY: size / 4 },
          ],
        },
      ]}
    >
      <View
        style={[
          styles.sliceFill,
          {
            width: size / 2,
            height: size / 2,
            backgroundColor: color,
            transform: [
              { skewY: `${45 - percentage * 3.6}deg` },
            ],
          },
        ]}
      />
    </View>
  );
};

export const CustomPieChart: React.FC<PieChartProps> = ({ data, size }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentRotation = 0;

  const textColor = useThemeColor({}, "text");

  return (
    <View style={styles.container}>
      <View style={[styles.chart, { width: size, height: size }]}>
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const slice = (
            <PieChartSlice
              key={index}
              percentage={percentage}
              color={item.color}
              rotation={currentRotation}
              size={size}
            />
          );
          currentRotation += percentage * 3.6;
          return slice;
        })}
      </View>
      <View style={styles.legend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={[styles.legendText, { color: textColor }]}>
              {item.label}: {item.value} ({((item.value / total) * 100).toFixed(1)}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chart: {
    position: 'relative',
  },
  slice: {
    position: 'absolute',
    overflow: 'hidden',
  },
  sliceFill: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  legend: {
    marginTop: 20,
    alignItems: 'flex-start',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColor: {
    width: 10,
    height: 10,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
  },
});