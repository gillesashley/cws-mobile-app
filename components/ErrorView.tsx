import React from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "./ThemedText";
import { Button } from "./ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigation } from "expo-router";
import { useAuthContext } from "./AuthProvider";

interface ErrorViewProps {
	error: string;
	onRetry: () => void;
}

export const ErrorView: React.FC<ErrorViewProps> = ({ error, onRetry }) => {
	const nav = useNavigation();
	const auth = useAuthContext();

	return (
		<View style={styles.container}>
			<ThemedText style={styles.errorText}>{error}</ThemedText>
			<ThemedText style={styles.errorText}>{auth.error?.message}</ThemedText>
			<Button title="Try Again" onPress={onRetry} style={styles.button} />
			{auth.error ? <Button title="login" onPress={() => nav.navigate("login")} /> : <></>}
		</View>
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
