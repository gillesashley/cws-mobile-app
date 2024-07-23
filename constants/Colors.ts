import { ColorSchemeName } from "react-native";

// Define the primary and secondary colors
const primaryColor = "#0200FF";
const secondaryColor = "#D0041D";

// Define the color scheme type
export type ColorScheme = "light" | "dark";

// Define the structure for a set of colors
export interface ColorSet {
  text: string;
  background: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  error: string;
  surface: string;
  border: string;
  placeholder: string;
}

// Define the Colors object with light and dark schemes
export const Colors: Record<ColorScheme, ColorSet> = {
  light: {
    text: "#11181C",
    background: "#FFFFFF",
    tint: primaryColor,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: primaryColor,
    primary: primaryColor,
    secondary: secondaryColor,
    accent: "#4D4DFF",
    success: "#34C759",
    warning: "#FF9500",
    error: secondaryColor,
    surface: "#F9FAFC",
    border: "#E1E3E6",
    placeholder: "#A0A4A8",
  },
  dark: {
    text: "#ECEDEE",
    background: "#151718",
    tint: "#FFFFFF",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#FFFFFF",
    primary: primaryColor,
    secondary: secondaryColor,
    accent: "#6E6EFF",
    success: "#32D74B",
    warning: "#FFD60A",
    error: "#FF453A",
    surface: "#1C1D1E",
    border: "#2C2D2E",
    placeholder: "#6C6D6E",
  },
};

// Helper function to get colors based on the color scheme
export function getColors(colorScheme: ColorSchemeName): ColorSet {
  return Colors[colorScheme === "dark" ? "dark" : "light"];
}
