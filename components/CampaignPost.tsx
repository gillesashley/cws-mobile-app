import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface CampaignPostProps {
  title: string;
  description: string;
  imageUrl: string;
  likes: number;
  shares: number;
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;

export function CampaignPost({
  title,
  description,
  imageUrl,
  likes,
  shares,
}: CampaignPostProps) {
  const backgroundColor = useThemeColor(
    { light: "#FFFFFF", dark: "#2C2C2C" },
    "background"
  );
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor(
    { light: "#757575", dark: "#A0A0A0" },
    "text"
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.contentContainer}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.description}>{description}</ThemedText>
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statItem}>
            <Ionicons name="heart-outline" size={20} color={iconColor} />
            <ThemedText style={styles.statText}>{likes}</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statItem}>
            <Ionicons name="share-social-outline" size={20} color={iconColor} />
            <ThemedText style={styles.statText}>{shares}</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
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
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  statText: {
    marginLeft: 4,
    fontSize: 14,
  },
});
