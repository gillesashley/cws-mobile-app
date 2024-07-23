import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  style?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  style,
  labelStyle,
  inputStyle,
}: InputProps) {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "border");

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, { color: textColor }, labelStyle]}>
        {label}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor,
            color: textColor,
            borderColor,
          },
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={useThemeColor({}, "icon")}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
  },
});
