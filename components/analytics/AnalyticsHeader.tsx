import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface AnalyticsHeaderProps {
  onInfoPress?: () => void;
}

export const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  onInfoPress,
}) => {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ThemedText style={styles.title}>Analytics</ThemedText>
      <TouchableOpacity onPress={onInfoPress}>
        <Feather name="info" size={24} color={textColor} />
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
