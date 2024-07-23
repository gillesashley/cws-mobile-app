import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface CampaignCardProps {
  title: string;
  description: string;
  likes: number;
  shares: number;
}

export function CampaignCard({
  title,
  description,
  likes,
  shares,
}: CampaignCardProps) {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ThemedText style={styles.title}>{title}</ThemedText>
      <ThemedText style={styles.description}>{description}</ThemedText>
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Ionicons name="heart" size={16} color={textColor} />
          <ThemedText style={styles.statText}>{likes}</ThemedText>
        </View>
        <View style={styles.stat}>
          <Ionicons name="share-social" size={16} color={textColor} />
          <ThemedText style={styles.statText}>{shares}</ThemedText>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  stat: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  statText: {
    marginLeft: 4,
    fontSize: 14,
  },
});
