import React, { useEffect, useState } from "react";
import { Modal, StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { Button } from "./ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigation } from "expo-router";
import { useAuthContext } from "./AuthProvider";

interface ErrorViewProps {
    error: string;
    onRetry?: () => void;
    onDismiss?: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ error, onRetry }) => {
    const nav = useNavigation();
    const auth = useAuthContext();
    const [active, setActive] = useState(false);

    useEffect(() => {

        !active&& !!error && setActive(true);
    }, [error]);

    const dismiss = () => setActive(false);
    const doTryAgain = () => {
        dismiss();
        if (onRetry) {
            onRetry();
        }
    };

    console.log({error})

    return (
        <Modal visible={active} animationType="none" onRequestClose={dismiss}>
            <View style={styles.container} className="flex flex-col gap-10">
              {/* <ThemedText>authenticated:{auth.isAuthenticated?'true':'false'}</ThemedText> */}
                <ThemedText style={styles.errorText}>{error}</ThemedText>
                <ThemedText style={styles.errorText}>{auth.error?.message}</ThemedText>
                {!!onRetry && <Button title="Try Again" onPress={doTryAgain} style={styles.button} />}
                <Button title="login" onPress={() => [dismiss(), auth.logout().then(() => nav.navigate("login"))]} />
                <Button title="Dismiss" onPress={dismiss} />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16
    },
    errorText: {
        fontSize: 16,
        textAlign: "center",
        marginBottom: 16
    },
    button: {
        minWidth: 120
    }
});
