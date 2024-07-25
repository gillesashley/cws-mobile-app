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
  const { token } = useAuthContext();

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
      if (isLiked) {
        return;
      }

      try {
        console.log("Attempting to like post:", postId);
        console.log("Token:", token);

        const response = await axios.post(
          `${API_BASE_URL}/campaign-messages/${postId}/like`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Like response:", response.data);

        if (response.status === 201) {
          setIsLiked(true);
          setLikes((prevLikes) => prevLikes + 1);
          onLikeSuccess(response.data.points_awarded);
        } else {
          throw new Error("Unexpected response status");
        }
      } catch (error) {
        console.error("Error liking post:", error);
        if (axios.isAxiosError(error)) {
          console.error("Error response data:", error.response?.data);
          console.error("Error response status:", error.response?.status);
          if (error.response?.status === 401) {
            Alert.alert(
              "Authentication Error",
              "Please log in again to like this post."
            );
          } else if (error.response?.status === 400) {
            setIsLiked(true);
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
    [postId, isLiked, token]
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
