import { useAuthContext } from "@/components/AuthProvider";
import { ThemedText } from "@/components/ThemedText";
import { API_BASE_URL } from "@/config/api";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useState } from "react";
import { Alert, Share, StyleSheet, TouchableOpacity } from "react-native";

interface ShareButtonProps {
  postId: string;
  shares: number;
  shareableUrl: string;
  title: string;
  onShareSuccess: (pointsAwarded: number) => void;
}

export default function ShareButton({
  postId,
  shares,
  shareableUrl,
  title,
  onShareSuccess,
}: ShareButtonProps) {
  const [shareCount, setShareCount] = useState(shares);
  const { token } = useAuthContext();
  const iconColor = useThemeColor(
    { light: "#757575", dark: "#A0A0A0" },
    "text"
  );

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: `Check out this campaign: ${shareableUrl}`,
      });

      if (result.action === Share.sharedAction) {
        // Optimistic update
        setShareCount(shareCount + 1);

        const response = await axios.post(
          `${API_BASE_URL}/campaign-messages/${postId}/share`,
          { platform: "other" }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );

        onShareSuccess(response.data.points_awarded);
      }
    } catch (error) {
      console.error("Error sharing post:", error);
      // Revert optimistic update on error
      setShareCount(shares);
      Alert.alert("Error", "Failed to share the post. Please try again.");
    }
  };

  return (
    <TouchableOpacity style={styles.statItem} onPress={handleShare}>
      <Ionicons name="share-social-outline" size={20} color={iconColor} />
      <ThemedText style={styles.statText}>{shareCount}</ThemedText>
    </TouchableOpacity>
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
});
