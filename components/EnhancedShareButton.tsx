import { API_BASE_URL } from "@/api/api";
import { useAuthContext } from "@/components/AuthProvider";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  Share,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

interface EnhancedShareButtonProps {
  campaignId: string;
  shareableUrl: string;
  initialShares: number;
  onShareSuccess: (newSharesCount: number) => void;
}

export function EnhancedShareButton({
  campaignId,
  shareableUrl,
  initialShares,
  onShareSuccess,
}: EnhancedShareButtonProps) {
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [shares, setShares] = useState(initialShares);
  const { user } = useAuthContext();

  const backgroundColor = useThemeColor({}, "background");
  const iconColor = useThemeColor(
    { light: "#757575", dark: "#A0A0A0" },
    "text"
  );

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
          )}`;
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
        `${API_BASE_URL}/campaign-messages/${campaignId}/share`,
        {
          platform,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      const newSharesCount = shares + 1;
      setShares(newSharesCount);
      onShareSuccess(newSharesCount);
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
    <>
      <TouchableOpacity
        style={styles.statItem}
        onPress={() => setIsShareModalVisible(true)}
      >
        <Ionicons name="share-social-outline" size={20} color={iconColor} />
        <ThemedText style={styles.statText}>{shares}</ThemedText>
      </TouchableOpacity>

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
    </>
  );
}

const styles = StyleSheet.create({
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
