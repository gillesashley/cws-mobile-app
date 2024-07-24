import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface ShareButtonProps {
  shares: number;
  onSharePress: () => void;
}

export default function ShareButton({
  shares,
  onSharePress,
}: ShareButtonProps) {
  const iconColor = useThemeColor(
    { light: "#757575", dark: "#A0A0A0" },
    "text"
  );

  return (
    <TouchableOpacity style={styles.statItem} onPress={onSharePress}>
      <Ionicons name="share-social-outline" size={20} color={iconColor} />
      <ThemedText style={styles.statText}>{shares}</ThemedText>
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
