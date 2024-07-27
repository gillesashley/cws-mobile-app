import { Button } from "@/components/ui/Button";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { StyleSheet, View } from "react-native";

type ProfileActionProps = {
  isLoading: boolean;
  onSave: () => void;
  onLogout: () => void;
};

export const ProfileActions: React.FC<ProfileActionProps> = ({
  isLoading,
  onSave,
  onLogout,
}) => {
  const primaryColor = useThemeColor({}, "primary");

  return (
    <View>
      <Button
        title={isLoading ? "Saving..." : "Save Changes"}
        onPress={onSave}
        style={[styles.button, { backgroundColor: primaryColor }]}
        disabled={isLoading}
      />
      <Button
        title="Logout"
        onPress={onLogout}
        style={[styles.button, styles.logoutButton]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: "#FF3B30",
  },
});
