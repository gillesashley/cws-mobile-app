import { useThemeColor } from "@/hooks/useThemeColor";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Alert, Dimensions, StyleSheet, View } from "react-native";
import { CampaignPostActions } from "./campaign/CampaignPostActions";
import { CampaignPostContent } from "./campaign/CampaignPostContent";
import { CampaignPostImage } from "./campaign/CampaignPostImage";

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width * 0.45;
const CARD_HEIGHT = height * 0.3;

export interface CampaignPostProps {
  id: string;
  title: string;
  content: string;
  image_url: string;
  likes_count: number;
  shares_count: number;
  shareable_url: string;
  user: {
    name: string;
  };
  reads: number;
}

export function CampaignPost(props: CampaignPostProps) {
  const backgroundColor = useThemeColor(
    { light: "#FFFfFF", dark: "#2C2C2C" },
    "background"
  );
  const accentColor = useThemeColor({}, "accent");
  const textColor = useThemeColor({}, "text");

  const handleLikeSuccess = (pointsAwarded: number) => {
    Alert.alert(
      "Success",
      `You have been awarded ${pointsAwarded} points for liking the post!`
    );
  };

  const handleShareSuccess = (pointsAwarded: number) => {
    Alert.alert(
      "Success",
      `You have been awarded ${pointsAwarded} points for sharing the post!`
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]} className='nfc-campaign-post-item xs:w-[100vw] sm:w-[50vw] lg:w-1/4 w-full'>
      <CampaignPostImage imageUrl={props.image_url} style={styles.image} />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.8)"]}
        style={styles.gradient}
      >
        <View style={styles.contentWrapper}>
          <CampaignPostContent {...props} textColor={textColor} />
          <CampaignPostActions
            {...props}
            onLikeSuccess={handleLikeSuccess}
            onShareSuccess={handleShareSuccess}
          />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 12, // Reduce border radius slightly to match the smaller card size
    marginRight: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: "70%", // Adjust the gradient height to match the new card size
    justifyContent: "flex-end",
  },
  contentWrapper: {
    padding: 8, // Slightly reduce padding for the smaller card
  },
});
