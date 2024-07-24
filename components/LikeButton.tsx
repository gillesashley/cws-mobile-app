import { useAuthContext } from "@/components/AuthProvider";
import { ThemedText } from "@/components/ThemedText";
import { API_BASE_URL } from "@/config/api";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

interface LikeButtonProps {
  postId: string;
  likes: number;
  onLikeSuccess: (pointsAwarded: number) => void;
}

export function LikeButton({ postId, likes, onLikeSuccess }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const { user } = useAuthContext();

  const iconColor = useThemeColor(
    { light: "#757575", dark: "#A0A0A0" },
    "text"
  );

  const handleLike = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/campaign-messages/${postId}/like`
      );
      setIsLiked(true);
      onLikeSuccess(response.data.points_awarded);
    } catch (error) {
      console.error("Error liking post:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          Alert.alert(
            "Authentication Error",
            "Please log in again to like this post."
          );
        } else if (error.response?.data?.message) {
          Alert.alert("Error", error.response.data.message);
        } else {
          Alert.alert("Error", "Failed to like the post. Please try again.");
        }
      } else {
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <TouchableOpacity style={styles.statItem} onPress={handleLike}>
      <Ionicons
        name={isLiked ? "heart" : "heart-outline"}
        size={20}
        color={isLiked ? "red" : iconColor}
      />
      <ThemedText style={styles.statText}>{likes}</ThemedText>
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
