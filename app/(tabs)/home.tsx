import { useUserData } from '@/components/UserDataContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuthContext } from '@/components/AuthProvider';
import { CampaignList } from '@/components/CampaignList';
import { CampaignPost } from '@/components/CampaignPost';
import { ErrorView } from '@/components/ErrorView';
import { Header } from '@/components/Header';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { CampaignMessage, fetchCampaignMessages, fetchUserBalance } from '@/services/services';

type RootStackParamList = {
	PointsPayment: undefined;
};

interface CampaignSectionProps {
	title: string;
	description: string;
	campaigns: CampaignMessage[];
	onSeeAll: () => void;
}

const CampaignSection: React.FC<CampaignSectionProps> = ({ title, description, campaigns, onSeeAll }) => (
	<View style={styles.sectionContainer}>
		<View style={styles.sectionHeader}>
			<ThemedText style={styles.sectionTitle}>{title}</ThemedText>
			<TouchableOpacity onPress={onSeeAll}>
				<ThemedText style={styles.seeAllText}>See All</ThemedText>
			</TouchableOpacity>
		</View>
		<ThemedText style={styles.sectionDescription}>{description}</ThemedText>
		<FlatList
			horizontal
			showsHorizontalScrollIndicator={false}
			data={campaigns.slice(0, 3)}
			renderItem={({ item }) => <CampaignPost {...item} />}
			keyExtractor={(item) => item.id}
			contentContainerStyle={styles.campaignScroll}
		/>
	</View>
);

export default function HomeScreen() {
	const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
	const { balance, updateBalance } = useUserData();
	const [campaignMessages, setCampaignMessages] = useState<CampaignMessage[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [userBalance, setUserBalance] = useState<number | null>(null);
	const [showAllCampaigns, setShowAllCampaigns] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const router = useRouter();

	const { token } = useAuthContext();
	const backgroundColor = useThemeColor({}, 'background');

	const loadData = useCallback(
		async (isRefreshing = false) => {
			console.log('loadData called, isRefreshing:', isRefreshing);
			if (!token) {
				console.log('No token found, setting error');
				setError('You must be logged in to view this content.');
				setIsLoading(false);
				setRefreshing(false);
				return;
			}
			try {
				console.log('Fetching campaign messages and user balance');
				const [messages, balance] = await Promise.all([fetchCampaignMessages(token), fetchUserBalance(token)]);
				console.log('Data fetched successfully');
				setCampaignMessages(messages);
				setUserBalance(balance);
				updateBalance(balance);
				setError(null);
			} catch (err) {
				console.error('Error fetching data:', err);
				setError('Failed to load data. Please try again.');
			} finally {
				setIsLoading(false);
				setRefreshing(false);
			}
		},
		[token, updateBalance]
	);

	useEffect(() => {
		console.log('HomeScreen mounted, calling loadData');
		loadData();
		return () => {
			console.log('HomeScreen unmounting');
		};
	}, [loadData]);

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		loadData(true);
	}, [loadData]);

	if (isLoading) {
		return (
			<SafeAreaView style={[styles.container, { backgroundColor }]}>
				<ActivityIndicator size='large' color={useThemeColor({}, 'text')} />
			</SafeAreaView>
		);
	}

	if (error) {
		return <ErrorView error={error} onRetry={() => loadData()} />;
	}

	return (
		<SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
			<Header balance={userBalance} onBalancePress={() => router.push('/points-payment')} />
			<ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#9Bd35A', '#689F38']} />}>
				<View style={styles.bannerContainer}>
					<View style={styles.banner}>
						<ThemedText style={styles.bannerText}>Banners</ThemedText>
					</View>
				</View>

				<CampaignSection
					title='Constituency'
					description='All campaigns in your constituency'
					campaigns={campaignMessages}
					onSeeAll={() => setShowAllCampaigns(true)}
				/>

				<View style={styles.bannerContainer}>
					<View style={styles.extraBanner}>
						<ThemedText style={styles.extraBannerText}>Extra Banners & Advertisements</ThemedText>
					</View>
				</View>

				<CampaignSection title='Region' description='All campaigns across the region' campaigns={campaignMessages} onSeeAll={() => setShowAllCampaigns(true)} />

				<CampaignSection
					title='National'
					description='All campaigns across the country'
					campaigns={campaignMessages}
					onSeeAll={() => setShowAllCampaigns(true)}
				/>
			</ScrollView>
			<Modal visible={showAllCampaigns} animationType='slide' onRequestClose={() => setShowAllCampaigns(false)}>
				<CampaignList campaignMessages={campaignMessages} onClose={() => setShowAllCampaigns(false)} />
			</Modal>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	bannerContainer: {
		paddingHorizontal: 16,
		marginBottom: 20,
	},
	banner: {
		height: 150,
		backgroundColor: '#f0f0f0',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 10,
	},
	extraBanner: {
		height: 100,
		backgroundColor: '#f0f0f0',
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 20,
		borderRadius: 10,
	},
	bannerText: {
		fontSize: 24,
		color: '#888',
	},
	sectionContainer: {
		marginBottom: 20,
	},
	sectionHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingHorizontal: 16,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: 'bold',
	},
	seeAllText: {
		color: 'blue',
	},
	sectionDescription: {
		fontSize: 14,
		color: '#666',
		paddingHorizontal: 16,
		marginBottom: 10,
	},
	campaignScroll: {
		paddingLeft: 16,
	},
	extraBannerText: {
		fontSize: 16,
		color: '#888',
	},
});
