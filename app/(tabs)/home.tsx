import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, Modal, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import guinness_banner from "@/assets/images/guinness_banner.jpeg";
import mtn_banner from "@/assets/images/mtn_banner.jpeg";
import { CampaignList } from "@/components/CampaignList";
import { CampaignPost } from "@/components/CampaignPost";
import { ErrorView } from "@/components/ErrorView";
import { Header } from "@/components/Header";
import { ThemedText } from "@/components/ThemedText";
import { LoadingState } from "@/components/profile-page/LoadingState";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CampaignMessage, useApi } from "@/services/services";
import { useSWRConfig } from "swr";
import { useIterator } from "../../hooks/useIterator";
interface CampaignSectionProps {
    title: string;
    description: string;
    campaigns: CampaignMessage[] | undefined;
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
            renderItem={({ item }) => (
                <View className="nfc-flatlist-item mx-2 w-[49vw]">
                    <CampaignPost {...item} />
                </View>
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.campaignScroll}
            className="nfc-campaignSection:flatlist w-[100vw] flex gap-5 "
        />
    </View>
);

export default function HomeScreen() {
    const api = useApi();
    const { data: ctyBanners, isLoading: qryBannersLoading } = api.getConstituencyBanners();
    const { data: rgBanners, isLoading: qryRgBannersLoading } = api.getRegionBanners();
    const { data: ntBanners, isLoading: qryNtBannersLoading } = api.getNationalBanners();
    const { data: regionalCampaigns, isLoading: qryRegionalCampaignsLoading } = api.getCampaignsRegional();
    const { data: nationalCampaigns, isLoading: qryNationalCampaignsLoading } = api.getCampaignsNational();
    const { data: constituencyCampaigns, isLoading: qryCampaignLoading, error: qryCampaignError, mutate: refreshCampaigns } = api.getCampaignsConstituency();
    const { data: userBalance, isLoading: qryBalanceLoading, error: qryBalanceError, mutate: refreshBalance } = api.getUserBalance();

    const nextCtyBanner = useIterator(ctyBanners);
    const nextRgBanner = useIterator(rgBanners);
    const nextNtBanner = useIterator(ntBanners);
    const nextDefaultBanner = useIterator([guinness_banner, mtn_banner], 6_000);

    const { mutate } = useSWRConfig();

    const isLoading =
        qryBalanceLoading ||
        qryCampaignLoading ||
        qryNationalCampaignsLoading ||
        qryRegionalCampaignsLoading ||
        qryBannersLoading ||
        qryRgBannersLoading ||
        qryNtBannersLoading;
    const error = qryBalanceError ?? qryCampaignError;

    const [showAllCampaigns, setShowAllCampaigns] = useState(false);
    const router = useRouter();

    const backgroundColor = useThemeColor({}, "background");

    const onRefresh = () => Promise.allSettled([refreshBalance(), refreshCampaigns(), mutate(() => true)]);

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor }]}>
                <LoadingState />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor }]} edges={["top"]}>
            <Header balance={userBalance?.balance} onBalancePress={() => router.push("/points-payment")} />

            <ScrollView refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} colors={["#9Bd35A", "#689F38"]} />}>
                <View style={styles.bannerContainer} className="mt-5">
                    <Image source={nextCtyBanner?.image_url ? { uri: nextCtyBanner?.image_url } : nextDefaultBanner} style={styles.banner} resizeMode="cover" />
                </View>

                <CampaignSection
                    title="Constituency"
                    description="All campaigns in your constituency"
                    campaigns={constituencyCampaigns ?? []}
                    onSeeAll={() => setShowAllCampaigns(true)}
                />

                <View style={styles.bannerContainer}>
                    <Image
                        source={nextRgBanner?.image_url ? { uri: nextRgBanner?.image_url } : nextDefaultBanner}
                        style={styles.extraBanner}
                        resizeMode="cover"
                    />
                </View>

                <CampaignSection
                    title="Region"
                    description="All campaigns across the region"
                    campaigns={regionalCampaigns ?? []}
                    onSeeAll={() => setShowAllCampaigns(true)}
                />

                <CampaignSection
                    title="National"
                    description="All campaigns across the country"
                    campaigns={nationalCampaigns ?? []}
                    onSeeAll={() => setShowAllCampaigns(true)}
                />
            </ScrollView>

            <Modal visible={showAllCampaigns} animationType="slide" onRequestClose={() => setShowAllCampaigns(false)}>
                <CampaignList campaignMessages={constituencyCampaigns} onClose={() => setShowAllCampaigns(false)} />
            </Modal>

            <ErrorView error={JSON.stringify(error?.message ?? error, null, 2)} onRetry={() => onRefresh()} />
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
        width: "100%",
        borderRadius: 10,
    },
    extraBanner: {
        height: 100,
        width: "100%",
        marginVertical: 20,
        borderRadius: 10,
    },
    sectionContainer: {
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    seeAllText: {
        color: "blue",
    },
    sectionDescription: {
        fontSize: 14,
        color: "#666",
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    campaignScroll: {
        paddingLeft: 16,
    },
});
