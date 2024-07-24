import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface ButtonProps {
  onPress: () => void;
  title: string;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
  disabled?: boolean;
}

export function Button({
  onPress,
  title,
  style,
  textStyle,
  disabled,
}: ButtonProps) {
  const backgroundColor = useThemeColor(
    { light: "#2196F3", dark: "#3F51B5" },
    "background"
  );
  const textColor = useThemeColor(
    { light: "#FFFFFF", dark: "#FFFFFF" },
    "text"
  );

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: disabled ? "#CCCCCC" : backgroundColor },
        ...(Array.isArray(style) ? style : [style]),
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.text,
          { color: textColor },
          ...(Array.isArray(textStyle) ? textStyle : [textStyle]),
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
