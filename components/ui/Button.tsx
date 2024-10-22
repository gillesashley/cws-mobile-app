import { useThemeColor } from "@/hooks/useThemeColor";
import React, { ComponentPropsWithoutRef } from "react";
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";

type ButtonProps = {
    onPress: () => void;
    title: string;
    style?: ViewStyle | ViewStyle[];
    textStyle?: TextStyle | TextStyle[];
    disabled?: boolean;
    backgroundColor?: string;
    textColor?: string;
} & ComponentPropsWithoutRef<typeof TouchableOpacity>;

export function Button({
    onPress,
    title,
    style,
    textStyle,
    disabled,
    backgroundColor: customBackgroundColor,
    textColor: customTextColor,
    ...otherProps
}: ButtonProps) {
    const themeBackgroundColor = useThemeColor({ light: "#2196F3", dark: "#3F51B5" }, "background");
    const themeTextColor = useThemeColor({ light: "#FFFFFF", dark: "#FFFFFF" }, "text");

    const backgroundColor = customBackgroundColor || themeBackgroundColor;
    const textColor = customTextColor || themeTextColor;

    return (
        <TouchableOpacity
            {...otherProps}
            style={[styles.button, { backgroundColor: disabled ? "#CCCCCC" : backgroundColor }, ...(Array.isArray(style) ? style : [style])]}
            onPress={onPress}
            disabled={disabled}>
            <Text style={[styles.text, { color: disabled ? "#666666" : textColor }, ...(Array.isArray(textStyle) ? textStyle : [textStyle])]}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 16,
        // fontWeight: "bold",
    },
});
