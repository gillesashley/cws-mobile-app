import React from "react";
import { Alert, StyleSheet, View } from "react-native";
import { CampaignPostProps } from "../CampaignPost";
import LikeButton from "../LikeButton";
import ShareButton from "../ShareButton";

type CampaignPostActionsProps = Pick<CampaignPostProps, "id" | "likes_count" | "shares_count" | "shareable_url" | "title"> & {
    onLikeSuccess: (pointsAwarded: number) => void;
    onShareSuccess: (pointsAwarded: number) => void;
};

export function CampaignPostActions({ id, likes_count, shares_count, shareable_url, title, onLikeSuccess, onShareSuccess }: CampaignPostActionsProps) {
    const handleLikeSuccess = (pointsAwarded: number) => {
        Alert.alert("Success", `You earned ${pointsAwarded} points for liking this post!`);
    };

    const handleShareSuccess = (pointsAwarded: number) => {
        Alert.alert("Success", `You earned ${pointsAwarded} points for sharing this post!`);
    };

    return (
        <View style={styles.statsContainer}>
            <LikeButton postId={id} initialLikes={likes_count} onLikeSuccess={handleLikeSuccess} />
            <ShareButton postId={id} shares={shares_count} shareableUrl={shareable_url} title={title} onShareSuccess={handleShareSuccess} />
        </View>
    );
}

const styles = StyleSheet.create({
    statsContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
        padding: 16,
    },
});
