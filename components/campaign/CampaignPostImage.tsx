import React from 'react';
import { Image, StyleSheet } from 'react-native';

interface CampaignPostImageProps {
  imageUrl: string;
}

export function CampaignPostImage({ imageUrl }: CampaignPostImageProps) {
  return <Image source={{ uri: imageUrl }} style={styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
});