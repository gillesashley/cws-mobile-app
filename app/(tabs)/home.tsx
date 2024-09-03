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
import { CampaignMessage, fetchCampaignMessages, fetchUserBalance, useApi } from '@/services/services';
import useSWR from 'swr';
import { AxiosError } from 'axios';
import { LoadingState } from '@/components/profile-page/LoadingState';

type RootStackParamList = {
	PointsPayment: undefined;
};

interface CampaignSectionProps {
	title: string;
	description: string;
	campaigns: CampaignMessage[]|undefined;
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
			data={campaigns?.slice(0, 3)}
			renderItem={({ item }) => <CampaignPost {...item} />}
			keyExtractor={(item) => item.id}
			contentContainerStyle={styles.campaignScroll}
		/>
	</View>
);

export default function HomeScreen() {
	const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
	

	const {getCampaignsConstituency: getCampaigns,getUserBalance,getCampaignsNational,getCampaignsRegional} =useApi()
	const {data:regionalCampaigns} = getCampaignsRegional()
	const {data:nationalCampaigns}=getCampaignsNational()
	const {data:contituencyCampaigns,isLoading:qryCampaignLoading,error:qryCampaignError,mutate:refreshCampaigns} = getCampaigns()
	const {data:userBalance,isLoading:qryBalanceLoading,error:qryBalanceError,mutate:refreshBalance} = getUserBalance()

	const isLoading = qryBalanceLoading??qryCampaignLoading
	const error = (qryBalanceError??qryCampaignError) 
	
	console.log({ contituencyCampaigns,userBalance,isLoading,error})

	const [showAllCampaigns, setShowAllCampaigns] = useState(false);
	const router = useRouter();

	const backgroundColor = useThemeColor({}, 'background');


	const onRefresh = ()=> Promise.allSettled([refreshBalance(),refreshCampaigns()])


	if (isLoading) {
		return (
			<SafeAreaView style={[styles.container, { backgroundColor }]}>
				<LoadingState />
			</SafeAreaView>
		);
	}

	if (error) {
		return <ErrorView error={JSON.stringify(error.message,null,2)} onRetry={() => onRefresh()} />;
	}

	return (
		<SafeAreaView style={[styles.container, { backgroundColor }]} edges={['top']}>
			<Header balance={userBalance?.balance} onBalancePress={() => router.push('/points-payment')} />
			<ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} colors={['#9Bd35A', '#689F38']} />}>
				<View style={styles.bannerContainer}>
					<View style={styles.banner}>
						<ThemedText style={styles.bannerText}>Banners</ThemedText>
					</View>
				</View>

				<CampaignSection
					title='Constituency'
					description='All campaigns in your constituency'
					campaigns={contituencyCampaigns??[]}
					onSeeAll={() => setShowAllCampaigns(true)}
				/>

				<View style={styles.bannerContainer}>
					<View style={styles.extraBanner}>
						<ThemedText style={styles.extraBannerText}>Extra Banners & Advertisements</ThemedText>
					</View>
				</View>

				<CampaignSection title='Region' description='All campaigns across the region' campaigns={regionalCampaigns??[]} onSeeAll={() => setShowAllCampaigns(true)} />

				<CampaignSection
					title='National'
					description='All campaigns across the country'
					campaigns={nationalCampaigns??[]}
					onSeeAll={() => setShowAllCampaigns(true)}
				/>
			</ScrollView>
			<Modal visible={showAllCampaigns} animationType='slide' onRequestClose={() => setShowAllCampaigns(false)}>
				<CampaignList campaignMessages={contituencyCampaigns} onClose={() => setShowAllCampaigns(false)} />
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
