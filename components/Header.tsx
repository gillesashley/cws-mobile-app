import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './ThemedText';
import { useThemeColor } from '@/hooks/useThemeColor';

interface HeaderProps {
  balance: number | null;
  onBalancePress: () => void;
}

export const Header: React.FC<HeaderProps> = ({ balance, onBalancePress }) => {
  const backgroundColor = useThemeColor({}, "primary");

  return (
    <View style={styles.header}>
      <Image
        source={require("@/assets/images/logo.png")}
        style={styles.logo}
      />
      <ThemedText style={styles.headerTitle}>CWS</ThemedText>
      <TouchableOpacity style={[styles.balanceContainer, { backgroundColor }]} onPress={onBalancePress}>
        <ThemedText style={styles.balanceText}>
          ₵ {balance !== null ? balance.toFixed(4) : '---'}
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  logo: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  balanceContainer: {
    marginLeft: "auto",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  balanceText: {
    color: "white",
    fontWeight: "bold",
  },
});