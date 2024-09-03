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
		<View style={styles.container} className="flex flex-col gap-10">
			<ThemedText style={styles.errorText}>{error}</ThemedText>
			<ThemedText style={styles.errorText}>{auth.error?.message}</ThemedText>
			<Button title="Try Again" onPress={onRetry} style={styles.button} />
			 <Button title="login" onPress={() => auth.logout().then(()=>nav.navigate("login"))} /> 
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
