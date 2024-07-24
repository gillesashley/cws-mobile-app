import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useState } from "react";
import { Alert, Dimensions, Image, StyleSheet, View } from "react-native";
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";
import ShareModal from "./ShareModel";

interface CampaignPostProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  likes: number;
  shares: number;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;

export function CampaignPost({
  id,
  title,
  description,
  imageUrl,
  likes: initialLikes,
  shares: initialShares,
}: CampaignPostProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [shares, setShares] = useState(initialShares);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);

  const backgroundColor = useThemeColor(
    { light: "#FFFFFF", dark: "#2C2C2C" },
    "background"
  );

  const handleLikeSuccess = (pointsAwarded: number) => {
    setLikes(likes + 1);
    Alert.alert(
      "Success",
      `You earned ${pointsAwarded} points for liking this post!`
    );
  };

  const handleShareSuccess = (pointsAwarded: number) => {
    setShares(shares + 1);
    Alert.alert(
      "Success",
      `You earned ${pointsAwarded} points for sharing this post!`
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.contentContainer}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.description}>{description}</ThemedText>
        <View style={styles.statsContainer}>
          <LikeButton
            postId={id}
            likes={likes}
            onLikeSuccess={handleLikeSuccess}
          />
          <ShareButton
            shares={shares}
            onSharePress={() => setIsShareModalVisible(true)}
          />
        </View>
      </View>
      <ShareModal
        isVisible={isShareModalVisible}
        onClose={() => setIsShareModalVisible(false)}
        onShare={handleShareSuccess}
        postId={id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    borderRadius: 16,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
});
