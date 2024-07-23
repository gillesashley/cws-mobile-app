import { Colors } from "@/constants/Colors";

type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

type ExtendedColorName = ColorName | "border";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ExtendedColorName
) {
  // Always use 'light' theme
  const theme = "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else if (colorName === "border") {
    // Default border colors based on the light color scheme
    return Colors.light.icon;
  } else {
    return Colors.light[colorName];
  }
}
