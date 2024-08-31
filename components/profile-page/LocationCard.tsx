import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Input } from "@/components/ui/Input";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Controller } from "react-hook-form";
import { StyleSheet } from "react-native";

interface Profile {
	constituency?: { name: string } | null;
	region?: { name: string } | null;
}

interface LocationCardProps {
	control: any;
}

export const LocationCard: React.FC<LocationCardProps> = ({ control }) => {
	const surfaceColor = useThemeColor({}, "surface");
	const textColor = useThemeColor({}, "text");

	return (
		<ThemedView style={[styles.card, { backgroundColor: surfaceColor }]}>
			<ThemedText style={styles.sectionTitle}>Location</ThemedText>
			<Controller
				control={control}
				name="constituency_id"
				render={({ field }) => (
					<Input label="Constituency" onChangeText={field.onChange} value={field.value || "Not set"} editable={false} />
				)}
			/>
			<Controller
				control={control}
				name="region_id"
				render={({ field }) => <Input label="Region" onChangeText={field.onChange} value={field.value || "Not set"} editable={false} />}
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
