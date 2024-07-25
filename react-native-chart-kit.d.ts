declare module "react-native-chart-kit" {
  import React from "react";
  import { ViewStyle } from "react-native";

  interface ChartConfig {
    backgroundColor?: string;
    backgroundGradientFrom?: string;
    backgroundGradientTo?: string;
    color?: (opacity: number) => string;
    style?: ViewStyle;
    decimalPlaces?: number;
    [key: string]: any;
  }

  export interface LineChartData {
    labels: string[];
    datasets: {
      data: number[];
      color?: (opacity: number) => string;
      strokeWidth?: number;
    }[];
  }

  export interface LineChartProps {
    data: LineChartData;
    width: number;
    height: number;
    chartConfig: ChartConfig;
    bezier?: boolean;
    style?: ViewStyle;
    [key: string]: any;
  }

  export class LineChart extends React.Component<LineChartProps> {}

  export interface BarChartProps {
    data: {
      labels: string[];
      datasets: {
        data: number[];
      }[];
    };
    width: number;
    height: number;
    yAxisLabel?: string;
    chartConfig: ChartConfig;
    style?: ViewStyle;
    [key: string]: any;
  }

  export class BarChart extends React.Component<BarChartProps> {}

  export interface PieChartProps {
    data: Array<{
      name: string;
      population: number;
      color: string;
      legendFontColor?: string;
      legendFontSize?: number;
    }>;
    width: number;
    height: number;
    chartConfig: ChartConfig;
    accessor: string;
    backgroundColor?: string;
    paddingLeft?: string;
    [key: string]: any;
  }

  export class PieChart extends React.Component<PieChartProps> {}

  export interface ProgressChartProps {
    data: number[] | { labels: string[]; data: number[] };
    width: number;
    height: number;
    chartConfig: ChartConfig;
    hideLegend?: boolean;
    [key: string]: any;
  }

  export class ProgressChart extends React.Component<ProgressChartProps> {}
}
