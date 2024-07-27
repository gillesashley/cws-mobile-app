import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader";
import { OverviewChart } from "@/components/analytics/OverviewChart";
import { PopularPostCard } from "@/components/analytics/PopularPostCard";
import { StatisticCard } from "@/components/analytics/StatisticsCard";
import { UserActivityBreakdown } from "@/components/analytics/UserActivityBreakdown";
import { useAuthContext } from "@/components/AuthProvider";
import { ExpoErrorBoundary } from "@/components/ErrorBoundary";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { AnalyticsData, fetchAnalyticsData } from "@/services/analytics";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function isValidAnalyticsData(data: any): data is AnalyticsData {
  return (
    data &&
    typeof data.postsShared === "number" &&
    typeof data.postsSharedChange === "number" &&
    typeof data.postLikes === "number" &&
    typeof data.postLikesChange === "number" &&
    typeof data.postsRead === "number" &&
    typeof data.postsReadChange === "number" &&
    (typeof data.totalPoints === "number" ||
      typeof data.totalPoints === "string") &&
    typeof data.totalPointsChange === "number" &&
    Array.isArray(data.overviewData) &&
    typeof data.popularPost === "object" &&
    data.popularPost !== null &&
    typeof data.popularPost.title === "string" &&
    typeof data.popularPost.reads === "number" &&
    typeof data.popularPost.likes === "number" &&
    typeof data.popularPost.shares === "number" &&
    (data.popularPost.imageUrl === null ||
      typeof data.popularPost.imageUrl === "string")
  );
}

function AnalyticsScreen() {
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
      console.log("Loading analytics data...");
      if (!token) {
        console.log("No token found");
        setError("You must be logged in to view analytics.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        console.log("Fetching analytics data...");
        const data = await fetchAnalyticsData(token);
        console.log("Fetched data:", JSON.stringify(data, null, 2));

        if (isValidAnalyticsData(data)) {
          setAnalyticsData(data);
          setError(null);
        } else {
          console.error("Invalid analytics data structure:", data);
          setError("Received invalid data structure from the server.");
        }
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

  console.log("Rendering AnalyticsScreen", {
    isLoading,
    error,
    analyticsData: "Data present",
  });

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={["right", "bottom", "left"]}
    >
      <ScrollView>
        <AnalyticsHeader onInfoPress={handleInfoPress} />
        <ThemedView style={styles.content}>
          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <StatisticCard
                title="Total Posts Shared"
                value={analyticsData.postsShared}
                change={analyticsData.postsSharedChange}
                icon="share-alt"
              />
            </View>
            <View style={styles.gridItem}>
              <StatisticCard
                title="Total Likes"
                value={analyticsData.postLikes}
                change={analyticsData.postLikesChange}
                icon="heart"
              />
            </View>
            <View style={styles.gridItem}>
              <StatisticCard
                title="Total Saved"
                value={analyticsData.postsRead}
                change={analyticsData.postsReadChange}
                icon="bookmark"
              />
            </View>
            <View style={styles.gridItem}>
              <StatisticCard
                title="Total Points"
                value={Number(analyticsData.totalPoints)}
                change={analyticsData.totalPointsChange}
                icon="star"
              />
            </View>
          </View>
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
            imageUrl={analyticsData.popularPost.imageUrl || undefined}
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
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  gridItem: {
    width: "48%",
    marginBottom: 16,
  },
});

export default function AnalyticsScreenWithErrorBoundary() {
  return (
    <ExpoErrorBoundary>
      <AnalyticsScreen />
    </ExpoErrorBoundary>
  );
}
