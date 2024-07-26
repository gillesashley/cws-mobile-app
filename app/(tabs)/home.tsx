import { useUserData } from "@/components/UserDataContext";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthContext } from "@/components/AuthProvider";
import { CampaignList } from "@/components/CampaignList";
import { CampaignPost } from "@/components/CampaignPost";
import { ErrorView } from "@/components/ErrorView";
import { Header } from "@/components/Header";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  CampaignMessage,
  fetchCampaignMessages,
  fetchUserBalance,
} from "@/services/services";

type RootStackParamList = {
  PointsPayment: undefined;
};

export default function HomeScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const { balance, updateBalance } = useUserData();
  const [campaignMessages, setCampaignMessages] = useState<CampaignMessage[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [showAllCampaigns, setShowAllCampaigns] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const { token } = useAuthContext();
  const backgroundColor = useThemeColor({}, "background");

  const loadData = useCallback(
    async (isRefreshing = false) => {
      if (!token) {
        setError("You must be logged in to view this content.");
        setIsLoading(false);
        setRefreshing(false);
        return;
      }
      try {
        const [messages, balance] = await Promise.all([
          fetchCampaignMessages(token),
          fetchUserBalance(token),
        ]);
        setCampaignMessages(messages);
        setUserBalance(balance);
        updateBalance(balance);
        setError(null);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data. Please try again.");
      } finally {
        setIsLoading(false);
        setRefreshing(false);
      }
    },
    [token, updateBalance]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData(true);
  }, [loadData]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <ActivityIndicator size="large" color={useThemeColor({}, "text")} />
      </SafeAreaView>
    );
  }

  if (error) {
    return <ErrorView error={error} onRetry={() => loadData()} />;
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={["top"]}
    >
      <Header
        balance={userBalance}
        onBalancePress={() => router.push("/points-payment")}
      />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#9Bd35A", "#689F38"]}
          />
        }
      >
        <ThemedView style={styles.content}>
          <View style={styles.sectionHeader}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Latest Campaigns
            </ThemedText>
            <TouchableOpacity onPress={() => setShowAllCampaigns(true)}>
              <ThemedText type="link">See All</ThemedText>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={campaignMessages.slice(0, 5)}
            renderItem={({ item }) => <CampaignPost {...item} />}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.campaignPostsContainer}
          />
        </ThemedView>
      </ScrollView>
      <Modal
        visible={showAllCampaigns}
        animationType="slide"
        onRequestClose={() => setShowAllCampaigns(false)}
      >
        <CampaignList
          campaignMessages={campaignMessages}
          onClose={() => setShowAllCampaigns(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  campaignPostsContainer: {
    paddingRight: 16,
  },
});
