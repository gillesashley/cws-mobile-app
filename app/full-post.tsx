import LikeButton from "@/components/LikeButton";
import ShareButton from "@/components/ShareButton";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FullPostScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id, title, description, imageUrl, likes, shares, shareableUrl } =
    params;

  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  const handleLikeSuccess = (pointsAwarded: number) => {
    // Handle like success
    console.log(`Liked! Earned ${pointsAwarded} points.`);
  };

  const handleShareSuccess = (pointsAwarded: number) => {
    // Handle share success
    console.log(`Shared! Earned ${pointsAwarded} points.`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={textColor} />
      </TouchableOpacity>
      <ScrollView>
        <Image source={{ uri: imageUrl as string }} style={styles.image} />
        <View style={styles.content}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.description}>{description}</ThemedText>
          <View style={styles.statsContainer}>
            <LikeButton
              postId={id as string}
              initialLikes={Number(likes)}
              onLikeSuccess={handleLikeSuccess}
            />
            <ShareButton
              postId={id as string}
              shares={Number(shares)}
              shareableUrl={shareableUrl as string}
              title={title as string}
              onShareSuccess={handleShareSuccess}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: 16,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
});
