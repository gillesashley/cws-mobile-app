import { useAuthContext } from "@/components/AuthProvider";
import { ThemedText } from "@/components/ThemedText";
import { API_BASE_URL } from "@/config/api";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React from "react";
import { Alert, Modal, StyleSheet, TouchableOpacity, View } from "react-native";

interface ShareModalProps {
  isVisible: boolean;
  onClose: () => void;
  onShare: (pointsAwarded: number) => void;
  postId: string;
}

export function ShareModal({
  isVisible,
  onClose,
  onShare,
  postId,
}: ShareModalProps) {
  const { user } = useAuthContext();
  const backgroundColor = useThemeColor({}, "background");

  const handleShare = async (platform: string) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/campaign-messages/${postId}/share`,
        {
          platform,
        }
      );
      onShare(response.data.points_awarded);
      onClose();
    } catch (error) {
      console.error("Error sharing post:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          Alert.alert(
            "Authentication Error",
            "Please log in again to share this post."
          );
        } else if (error.response?.data?.message) {
          Alert.alert("Error", error.response.data.message);
        } else {
          Alert.alert("Error", "Failed to share the post. Please try again.");
        }
      } else {
        Alert.alert("Error", "An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
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
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <ThemedText style={styles.closeButtonText}>Close</ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
