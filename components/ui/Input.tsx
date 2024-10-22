import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, TextStyle, View, ViewStyle } from "react-native";

interface InputProps extends TextInputProps {
    label: string;
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
    editable = true,
    ...restProps
}: InputProps) {
    const colorScheme = useThemeColor({}, "background");
    const colors = Colors[colorScheme === "dark" ? "dark" : "light"];

    return (
        <View style={[styles.container, style]}>
            <Text style={[styles.label, { color: colors.text }, labelStyle]}>{label}</Text>
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: editable ? colors.background : colors.surface,
                        color: colors.text,
                        borderColor: colors.border,
                    },
                    inputStyle,
                ]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={colors.placeholder}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                editable={editable}
                {...restProps}
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
        fontWeight: "600",
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
    },
});
