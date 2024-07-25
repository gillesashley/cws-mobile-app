import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { CampaignPostImage } from './campaign/CampaignPostImage';
import { CampaignPostContent } from './campaign/CampaignPostContent'; 
import { CampaignPostActions } from './campaign/CampaignPostActions'; 

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;

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
  const backgroundColor = useThemeColor({ light: '#FFFFFF', dark: '#2C2C2C' }, 'background');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <CampaignPostImage imageUrl={props.image_url} />
      <CampaignPostContent {...props} />
      <CampaignPostActions {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    borderRadius: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
});