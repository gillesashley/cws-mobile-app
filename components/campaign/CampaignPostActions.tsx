import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import LikeButton from '../LikeButton';
import ShareButton from '../ShareButton';
import { CampaignPostProps } from '../CampaignPost';

type CampaignPostActionsProps = Pick<CampaignPostProps, 'id' | 'likes_count' | 'shares_count' | 'shareable_url' | 'title'>;

export function CampaignPostActions({ id, likes_count, shares_count, shareable_url, title }: CampaignPostActionsProps) {
  const handleLikeSuccess = (pointsAwarded: number) => {
    Alert.alert('Success', `You earned ${pointsAwarded} points for liking this post!`);
  };

  const handleShareSuccess = (pointsAwarded: number) => {
    Alert.alert('Success', `You earned ${pointsAwarded} points for sharing this post!`);
  };

  return (
    <View style={styles.statsContainer}>
      <LikeButton postId={id} initialLikes={likes_count} onLikeSuccess={handleLikeSuccess} />
      <ShareButton
        postId={id}
        shares={shares_count}
        shareableUrl={shareable_url}
        title={title}
        onShareSuccess={handleShareSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 16,
  },
});