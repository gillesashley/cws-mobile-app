import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-chart-kit";

interface GenderDistributionProps {
    male: number;
    female: number;
}

export const GenderDistributionChart: React.FC<GenderDistributionProps> = ({ male, female }) => {
    const data = [
        {
            name: "Male",
            population: male,
            color: "#4267B2",
            legendFontColor: "#7F7F7F",
            legendFontSize: 12,
        },
        {
            name: "Female",
            population: female,
            color: "#5EEBC8",
            legendFontColor: "#7F7F7F",
            legendFontSize: 12,
        },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Reached Audience</Text>
            <PieChart
                data={data}
                width={300}
                height={200}
                chartConfig={{
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
            />
            <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: "#4267B2" }]} />
                    <Text style={styles.legendText}>Men {male.toFixed(2)}%</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: "#5EEBC8" }]} />
                    <Text style={styles.legendText}>Women {female.toFixed(2)}%</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFF",
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 12,
    },
    legendContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 12,
    },
    legendItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    legendColor: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    legendText: {
        fontSize: 14,
    },
});
