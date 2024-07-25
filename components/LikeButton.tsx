import { useAuthContext } from "@/components/AuthProvider";
import { ThemedText } from "@/components/ThemedText";
import { API_BASE_URL } from "@/config/api";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import debounce from "lodash/debounce";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";

interface LikeButtonProps {
  postId: string;
  initialLikes: number;
  onLikeSuccess: (pointsAwarded: number) => void;
}

export default function LikeButton({
  postId,
  initialLikes,
  onLikeSuccess,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const { user, token } = useAuthContext();

  const iconColor = useThemeColor(
    { light: "#757575", dark: "#A0A0A0" },
    "text"
  );

  useEffect(() => {
    fetchLikeStatus();
  }, []);

  const fetchLikeStatus = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/campaign-messages/${postId}/like-status`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsLiked(response.data.is_liked);
    } catch (error) {
      console.error("Error fetching like status:", error);
    }
  };

  const handleLike = useCallback(
    debounce(async () => {
      const previousLikes = likes;
      const previousIsLiked = isLiked;

      // Optimistic update
      setLikes(isLiked ? likes - 1 : likes + 1);
      setIsLiked(!isLiked);

      try {
        const response = await axios.post(
          `${API_BASE_URL}/campaign-messages/${postId}/like`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        onLikeSuccess(response.data.points_awarded);
      } catch (error) {
        // Revert optimistic update on error
        setLikes(previousLikes);
        setIsLiked(previousIsLiked);

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
          Alert.alert(
            "Error",
            "An unexpected error occurred. Please try again."
          );
        }
      }
    }, 300),
    [postId, likes, isLiked, token]
  );

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
