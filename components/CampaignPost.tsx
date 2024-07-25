import { useAuthContext } from "@/components/AuthProvider";
import { ThemedText } from "@/components/ThemedText";
import { API_BASE_URL } from "@/config/api";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  Modal,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface CampaignPostProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  likes: number;
  shares: number;
  shareableUrl: string;
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
  shareableUrl,
}: CampaignPostProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [shares, setShares] = useState(initialShares);
  const [isLiked, setIsLiked] = useState(false);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const { user } = useAuthContext();

  const backgroundColor = useThemeColor(
    { light: "#FFFFFF", dark: "#2C2C2C" },
    "background"
  );
  const textColor = useThemeColor({}, "text");
  const iconColor = useThemeColor(
    { light: "#757575", dark: "#A0A0A0" },
    "text"
  );

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/campaign-messages/${id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setLikes(likes + 1);
      setIsLiked(true);
      Alert.alert(
        "Success",
        `You earned ${response.data.points_awarded} points for liking this post!`
      );
    } catch (error) {
      console.error("Error liking post:", error);
      Alert.alert("Error", "Failed to like the post. Please try again.");
    }
  };

  const handleShare = async (platform: string) => {
    try {
      let url = "";
      let message = `Check out this campaign: ${shareableUrl}`;

      switch (platform) {
        case "whatsapp":
          url = `whatsapp://send?text=${encodeURIComponent(message)}`;
          break;
        case "facebook":
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareableUrl
          )}`;
          break;
        case "twitter":
          url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            shareableUrl
          )}&text=${encodeURIComponent(title)}`;
          break;
      }

      const canOpen = await Linking.canOpenURL(url);

      if (canOpen) {
        await Linking.openURL(url);
      } else {
        // Fallback to use Share API if the app is not installed
        await Share.share({
          message: message,
          url: shareableUrl,
        });
      }

      // After successful share, update the backend
      const response = await axios.post(
        `${API_BASE_URL}/campaign-messages/${id}/share`,
        {
          platform,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setShares(shares + 1);
      setIsShareModalVisible(false);
      Alert.alert(
        "Success",
        `You earned ${response.data.points_awarded} points for sharing this post!`
      );
    } catch (error) {
      console.error("Error sharing post:", error);
      Alert.alert("Error", "Failed to share the post. Please try again.");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Image source={{ uri: imageUrl }} style={styles.image} />
      <View style={styles.contentContainer}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.description}>{description}</ThemedText>
        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statItem} onPress={handleLike}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={20}
              color={isLiked ? "red" : iconColor}
            />
            <ThemedText style={styles.statText}>{likes}</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => setIsShareModalVisible(true)}
          >
            <Ionicons name="share-social-outline" size={20} color={iconColor} />
            <ThemedText style={styles.statText}>{shares}</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isShareModalVisible}
        onRequestClose={() => setIsShareModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor }]}>
            <ThemedText style={styles.modalTitle}>Share to:</ThemedText>
            <TouchableOpacity
              onPress={() => handleShare("facebook")}
              style={styles.shareOption}
            >
              <Ionicons name="logo-facebook" size={24} color="#3b5998" />
              <ThemedText style={styles.shareOptionText}>Facebook</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleShare("twitter")}
              style={styles.shareOption}
            >
              <Ionicons name="logo-twitter" size={24} color="#1da1f2" />
              <ThemedText style={styles.shareOptionText}>Twitter</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleShare("whatsapp")}
              style={styles.shareOption}
            >
              <Ionicons name="logo-whatsapp" size={24} color="#25d366" />
              <ThemedText style={styles.shareOptionText}>WhatsApp</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsShareModalVisible(false)}
              style={styles.closeButton}
            >
              <ThemedText style={styles.closeButtonText}>Close</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  shareOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    width: "100%",
  },
  shareOptionText: {
    marginLeft: 10,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: "blue",
  },
});
