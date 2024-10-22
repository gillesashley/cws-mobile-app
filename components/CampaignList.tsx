import { CampaignMessage } from "@/services/services";
import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CampaignPost } from "./CampaignPost";
import { ThemedText } from "./ThemedText";
import { Button } from "./ui/Button";

interface CampaignListProps {
    campaignMessages: CampaignMessage[] | undefined;
    onClose: () => void;
}

export const CampaignList: React.FC<CampaignListProps> = ({ campaignMessages, onClose }) => {
    return (
        <SafeAreaView style={styles.container} className="nfc-campaignPostsSafearea">
            <View style={styles.header}>
                <ThemedText type="title">All Campaigns</ThemedText>
                <Button title="Close" onPress={onClose} />
            </View>
            <FlatList
                data={campaignMessages}
                renderItem={({ item }) => <CampaignPost {...item} />}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                className="nfc-campiagnPost:flatList w-full"
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    listContent: {
        padding: 16,
        rowGap: 20,
    },
});
