import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { Dimensions, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";

interface UserActivityBreakdownProps {
    postsShared: number;
    postLikes: number;
    postsRead: number;
}

export const UserActivityBreakdown: React.FC<UserActivityBreakdownProps> = ({ postsShared, postLikes, postsRead }) => {
    const backgroundColor = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");

    const data = [
        {
            name: "Posts Shared",
            population: postsShared,
            color: "#FF6384",
            legendFontColor: textColor,
            legendFontSize: 12,
        },
        {
            name: "Post Likes",
            population: postLikes,
            color: "#36A2EB",
            legendFontColor: textColor,
            legendFontSize: 12,
        },
        {
            name: "Posts Read",
            population: postsRead,
            color: "#FFCE56",
            legendFontColor: textColor,
            legendFontSize: 12,
        },
    ];

    return (
        <ThemedView style={[styles.container, { backgroundColor }]}>
            <ThemedText style={styles.title}>Your Activity Breakdown</ThemedText>
            <PieChart
                data={data}
                width={Dimensions.get("window").width - 32}
                height={220}
                chartConfig={{
                    color: (opacity = 1) => textColor,
                    labelColor: (opacity = 1) => textColor,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
            />
        </ThemedView>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 12,
    },
});
