import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthContext } from "@/components/AuthProvider";
import { CampaignPost } from "@/components/CampaignPost";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CampaignMessage, fetchCampaignMessages } from "@/services/services";

export default function HomeScreen() {
  const [campaignMessages, setCampaignMessages] = useState<CampaignMessage[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuthContext();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  useEffect(() => {
    const loadCampaignMessages = async () => {
      if (!token) {
        setError("You must be logged in to view campaign messages.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const messages = await fetchCampaignMessages(token);
        setCampaignMessages(messages);
        setError(null);
      } catch (err) {
        console.error("Error fetching campaign messages:", err);
        setError("Failed to load campaign messages. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaignMessages();
  }, [token]);

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <ActivityIndicator size="large" color={textColor} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <ThemedText>{error}</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={["top"]}
    >
      <View style={styles.header}>
        <Image
          source={require("@/assets/images/logo.png")}
          style={styles.logo}
        />
        <ThemedText style={styles.headerTitle}>CWS</ThemedText>
        <View style={styles.balanceContainer}>
          <ThemedText style={styles.balanceText}>₵ 0.1346</ThemedText>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.content}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Latest Campaigns
          </ThemedText>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={campaignMessages}
            renderItem={({ item }) => (
              <CampaignPost
                id={item.id}
                title={item.title}
                description={item.content}
                imageUrl="https://via.placeholder.com/150" // You might want to add an image field to your campaign messages
                likes={item.likes_count}
                shares={item.shares_count}
                shareableUrl={item.shareable_url}
              />
            )}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.campaignPostsContainer}
          />
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  balanceContainer: {
    marginLeft: "auto",
    backgroundColor: "#5C4DFF",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  balanceText: {
    color: "white",
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  campaignPostsContainer: {
    paddingRight: 16,
  },
});
