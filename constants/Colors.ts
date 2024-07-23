/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";
const primaryColor = "#0200FF";
const secondaryColor = "#D0041D";

export const Colors = {
  light: {
    // text: '#11181C',
    // background: '#fff',
    // tint: tintColorLight,
    // icon: '#687076',
    // tabIconDefault: '#687076',
    // tabIconSelected: tintColorLight,
    text: "#11181C",
    background: "#FFFFFF",
    tint: primaryColor,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: primaryColor,
    primary: primaryColor,
    secondary: secondaryColor,
    accent: "#4D4DFF", // A slightly lighter shade of the primary color for accents
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
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};
