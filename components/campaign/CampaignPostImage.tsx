import React from 'react';
import { Image, StyleSheet, ImageStyle } from 'react-native';

interface CampaignPostImageProps {
  imageUrl: string;
  style?: ImageStyle;
}

export function CampaignPostImage({ imageUrl, style }: CampaignPostImageProps) {
  return <Image source={{ uri: imageUrl }} style={[styles.image, style]} />;
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
});