// full-post.tsx

import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { CampaignPostActions } from "@/components/campaign/CampaignPostActions";

export default function FullPostScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, title, content, imageUrl, likes_count, shares_count, shareable_url } = params;

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const handleLikeSuccess = (pointsAwarded: number) => {
    console.log(`Liked! Earned ${pointsAwarded} points.`);
  };

  const handleShareSuccess = (pointsAwarded: number) => {
    console.log(`Shared! Earned ${pointsAwarded} points.`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={textColor} />
      </TouchableOpacity>
      <ScrollView>
        {imageUrl && <Image source={{ uri: imageUrl as string }} style={styles.image} />}
        <View style={styles.content}>
          <ThemedText style={styles.title}>{title as string}</ThemedText>
          <ThemedText style={styles.description}>{content as string}</ThemedText>
          <CampaignPostActions
            id={id as string}
            likes_count={Number(likes_count)}
            shares_count={Number(shares_count)}
            shareable_url={shareable_url as string}
            title={title as string}
            onLikeSuccess={handleLikeSuccess}
            onShareSuccess={handleShareSuccess}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: 16,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
});