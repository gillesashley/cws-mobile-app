import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { CampaignPostProps } from "../CampaignPost";
type CampaignPostContentProps = Pick<
  CampaignPostProps,
  "id" | "title" | "content" | "likes_count" | "shares_count" | "shareable_url"
>;

export function CampaignPostContent({
  id,
  title,
  content,
  likes_count,
  shares_count,
  shareable_url,
}: CampaignPostContentProps) {
  const router = useRouter();

  const handleReadMore = () => {
    router.push({
      pathname: "/full-post",
      params: { id, title, content, likes_count, shares_count, shareable_url },
    });
  };

  return (
    <View style={styles.contentContainer}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText
        style={styles.description}
        numberOfLines={4}
        ellipsizeMode="tail"
      >
        {content}
      </ThemedText>
      <TouchableOpacity onPress={handleReadMore}>
        <ThemedText style={styles.readMore}>Read More</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
  readMore: {
    color: "#5C4DFF",
    fontWeight: "bold",
    marginBottom: 12,
  },
});
