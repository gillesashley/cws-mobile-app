import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CampaignPost } from './CampaignPost'; 
import { ThemedText } from './ThemedText';
import { Button } from './ui/Button';
import { CampaignMessage } from '@/services/services';

interface CampaignListProps {
  campaignMessages: CampaignMessage[];
  onClose: () => void;
}

export const CampaignList: React.FC<CampaignListProps> = ({ campaignMessages, onClose }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">All Campaigns</ThemedText>
        <Button title="Close" onPress={onClose} />
      </View>
      <FlatList
        data={campaignMessages}
        renderItem={({ item }) => <CampaignPost {...item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  listContent: {
    padding: 16,
  },
});