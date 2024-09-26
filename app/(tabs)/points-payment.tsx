import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthContext } from '@/components/AuthProvider';
import PointsBalance from '@/components/points-payments/PointBalance';
import WithdrawalForm from '@/components/points-payments/WithdrawalForm';
import WithdrawalHistoryItem from '@/components/points-payments/WithdrawalHistoryItem';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import { useThemeColor } from '@/hooks/useThemeColor';
import { buildApiUrl, fetchPointsData, PointsData, submitWithdrawalRequest, useApi } from '@/services/services';
import useSWR, { mutate } from 'swr';
import useSWRMutation from 'swr/dist/mutation';
import { z } from 'zod';



export default function PointsPaymentScreen() {
	const auth = useAuthContext();
	const api = useApi();

	const {data: pointsData,isLoading,isValidating: refreshing,mutate: onRefresh,error:qryErrPoints} = api.getPoints();

	const {
		trigger,
		isMutating: isSubmitting,
		error: mxErrWithdrawal
	} = api.mxWithdrawals();

	const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);

	const { token } = auth;
	const error = mxErrWithdrawal||qryErrPoints
	const backgroundColor = useThemeColor({}, 'background');

	const handleWithdrawalRequest = async (amount: number) => {
		await trigger(
			{ amount },
			{
				onSuccess: () => [Alert.alert('Success', 'Withdrawal request submitted successfully'), onRefresh(), setShowWithdrawalForm(false)],
				onError: err => console.error('Error submitting withdrawal request:', error)
			}
		);
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
				<ActivityIndicator size="large" color={useThemeColor({}, 'text')} />
			</SafeAreaView>
		);
	}

	if (error ) {
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
		<SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
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
		color: 'red',
		marginBottom: 16
	},
	historyTitle: {
		marginTop: 24,
		marginBottom: 16
	},
	emptyText: {
		textAlign: 'center',
		marginTop: 16
	},
	titleContainer: {
		marginBottom: 20
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 8
	},
	titleUnderline: {
		height: 3,
		width: 60,
		backgroundColor: useThemeColor({}, 'accent'),
		borderRadius: 2
	}
});
