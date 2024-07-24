import React from "react";
import { FlatList, Image, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { CampaignPost } from "@/components/CampaignPost";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

const campaignPosts = [
  {
    id: "1",
    title: "Education Reform",
    description: "Join us in our mission to improve the education system.",
    imageUrl:
      "https://plus.unsplash.com/premium_photo-1682125707803-f985bb8d8b6a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJlc2lkZW50fGVufDB8fDB8fHww",
    likes: 120,
    shares: 45,
  },
  {
    id: "2",
    title: "Healthcare Initiative",
    description: "Support our efforts to enhance healthcare services.",
    imageUrl:
      "https://images.unsplash.com/photo-1721309689084-da4ab4fae11c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D",
    likes: 98,
    shares: 32,
  },
  {
    id: "3",
    title: "Environmental Protection",
    description: "Help us preserve our natural resources.",
    imageUrl:
      "https://images.unsplash.com/photo-1580128660010-fd027e1e587a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dHJ1bXB8ZW58MHx8MHx8fDA%3D",
    likes: 156,
    shares: 67,
  },
];

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

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
            data={campaignPosts}
            renderItem={({ item }) => (
              <CampaignPost
                id={item.id}
                title={item.title}
                description={item.description}
                imageUrl={item.imageUrl}
                likes={item.likes}
                shares={item.shares}
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
