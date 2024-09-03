import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Input } from "@/components/ui/Input";
import { useThemeColor } from "@/hooks/useThemeColor";
import { UserProfile } from "@/services/services";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet } from "react-native";

type PersonalInfoCardProps = {
	control: any
};

export const PersonalInfoCard: React.FC<PersonalInfoCardProps> = ({ control }) => {
	const surfaceColor = useThemeColor({}, "surface");
	const textColor = useThemeColor({}, "text");

	return (
		<ThemedView style={[styles.card, { backgroundColor: surfaceColor }]}>
			<ThemedText style={styles.sectionTitle}>Personal Information</ThemedText>

			<Controller
				name="name"
				control={control}
				render={({ field }) => <Input label="Name" value={field.value} onChangeText={field.onChange} placeholder="Enter your name" />}
			/>

			<Controller
				name="email"
				control={control}
				render={({ field }) => (
					<Input
						label="Email"
						value={field.value}
						onChangeText={field.onChange}
						placeholder="Enter your email"
						keyboardType="email-address"
					/>
				)}
			/>

			<Controller
				name="phone"
				control={control}
				render={({ field }) => (
					<Input
						label="Phone"
						value={field.value}
						onChangeText={field.onChange}
						placeholder="Enter your phone number"
						keyboardType="phone-pad"
					/>
				)}
			/>

			<Controller
				name="area"
				control={control}
				render={({ field }) => <Input label="Area" value={field.value} onChangeText={field.onChange} placeholder="Enter your area" />}
			/>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	card: {
		borderRadius: 10,
		padding: 16,
		marginHorizontal: 16,
		marginBottom: 16,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 16
	}
});
