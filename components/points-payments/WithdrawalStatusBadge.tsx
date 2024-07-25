import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from '@expo/vector-icons';

interface WithdrawalStatusBadgeProps {
  status: string;
}

const WithdrawalStatusBadge: React.FC<WithdrawalStatusBadgeProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'approved':
        return '#34C759';
      case 'pending':
        return '#FF9500';
      case 'rejected':
        return '#FF3B30';
      default:
        return '#8E8E93';
    }
  };

  const getStatusIcon = () => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'checkmark-circle';
      case 'pending':
        return 'time';
      case 'rejected':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: getStatusColor() }]}>
      <Ionicons name={getStatusIcon() as any} size={16} color="white" />
      <ThemedText style={styles.text}>{status}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    color: 'white',
    marginLeft: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default WithdrawalStatusBadge;