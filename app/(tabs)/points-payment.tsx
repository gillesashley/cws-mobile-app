import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthContext } from "@/components/AuthProvider";
import PointsBalance from "@/components/points-payments/PointBalance";
import WithdrawalForm from "@/components/points-payments/WithdrawalForm";
import WithdrawalHistoryItem from "@/components/points-payments/WithdrawalHistoryItem";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/Button";
import { useThemeColor } from "@/hooks/useThemeColor";
import { buildApiUrl, fetchPointsData, PointsData, submitWithdrawalRequest, useAxios } from "@/services/services";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/dist/mutation";
import { z } from "zod";

const zPointWithdrawals = z.object({
	balance: z.number(),
	withdrawalHistory: z
		.object({
			id: z
				.string()
				.or(z.number())
				.transform(d => d + ""),
			amount: z
				.number()
				.or(z.string())
				.transform(d => Number(d??0)),
			status: z.string(),
			created_at: z
				.date()
				.or(z.string())
				.transform(d => new Date(d).toISOString()),
			update_at: z.optional(
				z
					.date()
					.or(z.string())
					.transform(d => new Date(d).toISOString())
			)
		})
		.array()
});

export default function PointsPaymentScreen() {
	const auth = useAuthContext();
	const axios = useAxios();

	const {
		data: pointsData,
		isLoading,
		isValidating: refreshing,
		mutate: onRefresh
	} = useSWR({ url: buildApiUrl("/points"), auth }, ({ url }) =>
		axios()
			.get(url)
			.then(d => zPointWithdrawals.parse(d.data))
	);

	const {
		trigger,
		isMutating: isSubmitting,
		error: error
	} = useSWRMutation({ url: buildApiUrl("/reward-withdrawals"), amount: 0 }, ({ url }, { arg }: { arg: { amount: number } }) => {
		return axios()
			.post(url, arg)
			.then(d => d.data);
	});

	const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);

	const { token } = auth;
	const backgroundColor = useThemeColor({}, "background");

	const handleWithdrawalRequest = async (amount: number) => {
		if (!token) {
			// setError('You must be logged in to make a withdrawal');
			return;
		}

		try {
			await trigger({ token, amount }, { onSuccess: () => [onRefresh(), setShowWithdrawalForm(false)] });
			Alert.alert("Success", "Withdrawal request submitted successfully");
		} catch (error) {
			console.error("Error submitting withdrawal request:", error);
			if (error instanceof Error) {
				// setError(`Failed to submit withdrawal request: ${error.message}`);
			} else {
				// setError('An unexpected error occurred. Please try again later.');
			}
		} finally {
			// setIsSubmitting(false);
		}
	};

	console.log({ pointsData });

	const ListHeader = () => (
		<View>
			<ThemedView style={styles.titleContainer}>
				<ThemedText style={styles.title}>Points & Payments</ThemedText>
				<ThemedView style={styles.titleUnderline} />
			</ThemedView>
			{error && <ThemedText style={styles.errorText}>{error}</ThemedText>}
			{pointsData && <PointsBalance balance={pointsData.balance} />}
			{!showWithdrawalForm && (
				<Button title="Request Withdrawal" onPress={() => setShowWithdrawalForm(true)} style={styles.withdrawButton} />
			)}
			{showWithdrawalForm && (
				<WithdrawalForm
					onSubmit={handleWithdrawalRequest}
					onCancel={() => setShowWithdrawalForm(false)}
					maxAmount={(pointsData?.balance ?? 0) / 50}
					isSubmitting={isSubmitting}
				/>
			)}
			{pointsData && pointsData?.withdrawalHistory?.length > 0 && (
				<ThemedText type="subtitle" style={styles.historyTitle}>
					Withdrawal History
				</ThemedText>
			)}
		</View>
	);

	if (isLoading) {
		return (
			<SafeAreaView style={[styles.container, { backgroundColor }]}>
				<ActivityIndicator size="large" color={useThemeColor({}, "text")} />
			</SafeAreaView>
		);
	}

	if (error && error.includes("Points feature is not available")) {
		return (
			<SafeAreaView style={[styles.container, { backgroundColor }]}>
				<ThemedView style={styles.content}>
					<ThemedText type="title">Points & Payments</ThemedText>
					<ThemedText style={styles.errorText}>{error}</ThemedText>
					<ThemedText>We're working on bringing this feature to you soon. Please check back later.</ThemedText>
				</ThemedView>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={[styles.container, { backgroundColor }]} edges={["top"]}>
			<FlatList
				data={pointsData?.withdrawalHistory}
				renderItem={({ item }) => <WithdrawalHistoryItem withdrawal={item} />}
				keyExtractor={item => item.id.toString()}
				ListHeaderComponent={ListHeader}
				ListEmptyComponent={!isLoading && <ThemedText style={styles.emptyText}>No withdrawal history</ThemedText>}
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
				contentContainerStyle={styles.content}
			/>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	content: {
		padding: 16
	},
	withdrawButton: {
		marginBottom: 16
	},
	errorText: {
		color: "red",
		marginBottom: 16
	},
	historyTitle: {
		marginTop: 24,
		marginBottom: 16
	},
	emptyText: {
		textAlign: "center",
		marginTop: 16
	},
	titleContainer: {
		marginBottom: 20
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 8
	},
	titleUnderline: {
		height: 3,
		width: 60,
		backgroundColor: useThemeColor({}, "accent"),
		borderRadius: 2
	}
});
