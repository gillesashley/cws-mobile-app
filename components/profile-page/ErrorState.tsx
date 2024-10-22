import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/Button";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface ErrorStateProps {
    error: string;
    onRetry: () => void;
    onLogout: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry, onLogout }) => {
    const backgroundColor = useThemeColor({}, "background");

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
            <View style={styles.buttonContainer}>
                <Button title="Try Again" onPress={onRetry} style={styles.button} />
                <Button title="Logout" onPress={onLogout} style={[styles.button, styles.logoutButton]} />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    errorText: {
        color: "#FF3B30",
        textAlign: "center",
        marginBottom: 20,
        fontSize: 16,
    },
    buttonContainer: {
        width: "100%",
    },
    button: {
        marginBottom: 12,
    },
    logoutButton: {
        backgroundColor: "#FF3B30",
    },
});
