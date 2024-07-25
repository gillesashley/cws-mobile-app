import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader";
import { OverviewChart } from "@/components/analytics/OverviewChart";
import { PopularPostCard } from "@/components/analytics/PopularPostCard";
import { StatisticCard } from "@/components/analytics/StatisticsCard";
import { UserActivityBreakdown } from "@/components/analytics/UserActivityBreakdown";
import { useAuthContext } from "@/components/AuthProvider";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { AnalyticsData, fetchAnalyticsData } from "@/services/analytics";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AnalyticsScreen() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuthContext();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  useEffect(() => {
    const loadAnalyticsData = async () => {
      if (!token) {
        setError("You must be logged in to view analytics.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await fetchAnalyticsData(token);
        setAnalyticsData(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError("Failed to load analytics data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadAnalyticsData();
  }, [token]);

  const handleInfoPress = () => {
    Alert.alert(
      "Analytics Info",
      "This screen shows your activity and engagement statistics. Swipe down to refresh the data."
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <ActivityIndicator size="large" color={textColor} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <ThemedText>{error}</ThemedText>
      </SafeAreaView>
    );
  }

  if (!analyticsData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor }]}>
        <ThemedText>No data available</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={["top"]}
    >
      <ScrollView>
        <AnalyticsHeader onInfoPress={handleInfoPress} />
        <ThemedView style={styles.content}>
          <StatisticCard
            title="Posts Shared"
            value={analyticsData.postsShared}
            change={analyticsData.postsSharedChange}
          />
          <StatisticCard
            title="Post Likes"
            value={analyticsData.postLikes}
            change={analyticsData.postLikesChange}
          />
          <StatisticCard
            title="Posts Read"
            value={analyticsData.postsRead}
            change={analyticsData.postsReadChange}
          />
          <StatisticCard
            title="Total Points"
            value={analyticsData.totalPoints}
            change={analyticsData.totalPointsChange}
          />
          <UserActivityBreakdown
            postsShared={analyticsData.postsShared}
            postLikes={analyticsData.postLikes}
            postsRead={analyticsData.postsRead}
          />
          <PopularPostCard
            title={analyticsData.popularPost.title}
            views={analyticsData.popularPost.reads}
            likes={analyticsData.popularPost.likes}
            shares={analyticsData.popularPost.shares}
            imageUrl={analyticsData.popularPost.imageUrl}
          />
          <OverviewChart
            data={{
              labels: ["Jan", "Feb", "Mar", "Apr", "May"],
              datasets: [
                {
                  data: analyticsData.overviewData,
                  color: (opacity = 1) => `rgba(66, 103, 178, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
            }}
          />
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
});
