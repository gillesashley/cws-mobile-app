import { API_BASE_URL } from "@/api/api";
import { useAuthContext } from "@/components/AuthProvider";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import React, { useState } from "react";
import { Alert, Platform, Share, StyleSheet, TouchableOpacity } from "react-native";

interface ShareButtonProps {
    postId: string;
    shares: number;
    shareableUrl: string;
    title: string;
    onShareSuccess: (pointsAwarded: number) => void;
}

export default function ShareButton({ postId, shares, shareableUrl, title, onShareSuccess }: ShareButtonProps) {
    const [shareCount, setShareCount] = useState(shares);
    const { token } = useAuthContext();
    const iconColor = useThemeColor({ light: "#FFFFFF", dark: "#A0A0A0" }, "text");

    const handleShare = async () => {
        try {
            const result = await Share.share({
                message: `Check out this campaign: ${shareableUrl}`,
                url: shareableUrl, // iOS only
                title: title, // Android only
            });

            if (result.action === Share.sharedAction) {
                let platform = "other"; // Default to 'other'

                if (Platform.OS === "ios") {
                    // iOS
                    if (result.activityType) {
                        if (result.activityType.includes("facebook")) platform = "facebook";
                        else if (result.activityType.includes("twitter")) platform = "twitter";
                        else if (result.activityType.includes("whatsapp")) platform = "whatsapp";
                    }
                } else {
                    // Android
                    platform = "shared"; // Use 'shared' for Android as we can't determine the exact platform
                }

                console.log("Sharing platform:", platform);

                try {
                    const response = await axios.post(
                        `${API_BASE_URL}/campaign-messages/${postId}/share`,
                        { platform },
                        { headers: { Authorization: `Bearer ${token}` } },
                    );

                    setShareCount((prevCount) => prevCount + 1);
                    onShareSuccess(response.data.points_awarded);
                } catch (error) {
                    console.error("Error recording share:", error);
                    if (axios.isAxiosError(error) && error.response) {
                        console.error("Server response:", error.response.data);
                    }
                    Alert.alert("Error", "Failed to record the share. Please try again.");
                }
            }
        } catch (error) {
            console.error("Error sharing post:", error);
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
        color: "#FFFFFF",
    },
});
