import { useThemeColor } from "@/hooks/useThemeColor";
import { Text as RNText, StyleSheet, TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: "default" | "title" | "defaultSemiBold" | "subtitle" | "link";
    weight?: "normal" | "bold";
    fontStyle?: "normal" | "italic";
};

export function ThemedText({ style, lightColor, darkColor, type = "default", weight = "normal", fontStyle = "normal", ...rest }: ThemedTextProps) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

    let fontFamily = "PoppinsRegular";
    if (weight === "bold" && fontStyle === "italic") {
        fontFamily = "PoppinsBoldItalic";
    } else if (weight === "bold") {
        fontFamily = "PoppinsBold";
    } else if (fontStyle === "italic") {
        fontFamily = "PoppinsItalic";
    }

    return <RNText style={[{ color, fontFamily }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
    default: {
        fontSize: 14,
        lineHeight: 24,
    },
    defaultSemiBold: {
        fontSize: 14,
        lineHeight: 24,
        fontWeight: "600",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        lineHeight: 32,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    link: {
        lineHeight: 30,
        fontSize: 16,
        color: "#0a7ea4",
    },
});
