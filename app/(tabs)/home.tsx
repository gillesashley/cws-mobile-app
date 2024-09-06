import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, Modal, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CampaignList } from '@/components/CampaignList';
import { CampaignPost } from '@/components/CampaignPost';
import { ErrorView } from '@/components/ErrorView';
import { Header } from '@/components/Header';
import { LoadingState } from '@/components/profile-page/LoadingState';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';
import { CampaignMessage, useApi } from '@/services/services';
import mtnBanner from '@/assets/images/mtn_banner.png'
import guinessBanner from '@/assets/images/guinness_banner.png'

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
	

	const {getCampaignsConstituency: getCampaigns,getUserBalance,getCampaignsNational,getCampaignsRegional} =useApi()
	const {data:regionalCampaigns} = getCampaignsRegional()
	const {data:nationalCampaigns}=getCampaignsNational()
	const {data:contituencyCampaigns,isLoading:qryCampaignLoading,error:qryCampaignError,mutate:refreshCampaigns} = getCampaigns()
	const {data:userBalance,isLoading:qryBalanceLoading,error:qryBalanceError,mutate:refreshBalance} = getUserBalance()

	const isLoading = qryBalanceLoading??qryCampaignLoading
	const error = (qryBalanceError??qryCampaignError) 
	

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
					<Image
					source={mtnBanner}
					style={styles.banner}
					resizeMode="cover"
					/>
				</View>

				<CampaignSection
					title='Constituency'
					description='All campaigns in your constituency'
					campaigns={contituencyCampaigns??[]}
					onSeeAll={() => setShowAllCampaigns(true)}
				/>

				<View style={styles.bannerContainer}>
					<Image
						source={guinessBanner}
						style={styles.extraBanner}
						resizeMode="cover"
					/>
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
		width: '100%',
		borderRadius: 10,
	  },
	  extraBanner: {
		height: 100,
		width: '100%',
		marginVertical: 20,
		borderRadius: 10,
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
});
