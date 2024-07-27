import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Image, StyleSheet } from "react-native";

import Placeholder from "@/assets/images/no-image.png";

interface PopularPostCardProps {
  title: string;
  views: number;
  likes: number;
  shares: number;
  imageUrl?: string;
}

export const PopularPostCard: React.FC<PopularPostCardProps> = ({
  title,
  views,
  likes,
  shares,
  imageUrl,
}) => {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ThemedText style={styles.title}>Most Popular Post</ThemedText>
      <ThemedView style={styles.postContainer}>
        <Image
          source={imageUrl ? { uri: imageUrl } : Placeholder}
          style={styles.image}
        />
        <ThemedView style={styles.infoContainer}>
          <ThemedText style={styles.postTitle} numberOfLines={2}>
            {title}
          </ThemedText>
          <ThemedText style={styles.stats}>
            Views: {views.toLocaleString()}
          </ThemedText>
          <ThemedText style={styles.stats}>
            Likes: {likes.toLocaleString()}
          </ThemedText>
          <ThemedText style={styles.stats}>
            Shares: {shares.toLocaleString()}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  postContainer: {
    flexDirection: "row",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  postTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  stats: {
    fontSize: 12,
    marginBottom: 2,
  },
});
