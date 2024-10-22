import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/Button";
import { useThemeColor } from "@/hooks/useThemeColor";

interface FAQItemProps {
    question: string;
    answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
    const accentColor = useThemeColor({}, "accent");
    return (
        <ThemedView style={styles.faqItem} className="gap-4">
            <View style={styles.questionContainer} className="gap-4">
                <Ionicons name="help-circle-outline" size={24} color={accentColor} style={styles.icon} />
                <ThemedText style={styles.question}>{question}</ThemedText>
            </View>
            <ThemedText style={styles.answer}>{answer}</ThemedText>
        </ThemedView>
    );
};

export default function HelpScreen() {
    const backgroundColor = useThemeColor({}, "background");
    const accentColor = useThemeColor({}, "accent");

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor }]} edges={["top"]}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <ThemedView className="flex flex-col gap-6 p-4 text-center">
                    <ThemedText style={styles.title} className="h-[4rem] align-middle">
                        Help & Support
                    </ThemedText>

                    <ThemedView style={styles.faqContainer} className="flex flex-col gap-4">
                        <ThemedText style={styles.sectionTitle}>Frequently Asked Questions</ThemedText>
                        <FAQItem
                            question="How do I earn points?"
                            answer="You can earn points by liking (5 points), sharing (10 points), and reading (2 points) campaign content."
                        />
                        <FAQItem
                            question="How can I withdraw my earnings?"
                            answer="Once you've accumulated at least 500 points (₵10.00), you can request a withdrawal from the Points & Payments page."
                        />
                        <FAQItem
                            question="How do I update my profile information?"
                            answer="You can update your profile information on the Profile page. Don't forget to save your changes!"
                        />
                    </ThemedView>

                    <ThemedView style={styles.contactContainer} className="gap-4 mt-5">
                        <ThemedText style={styles.sectionTitle}>Contact Support</ThemedText>
                        <View style={styles.contactItem} className="gap-4">
                            <Ionicons name="mail-outline" size={24} color={accentColor} style={styles.icon} />
                            <ThemedText style={styles.contactText}>support@campaignwithus.com</ThemedText>
                        </View>
                        <View style={styles.contactItem} className="gap-4">
                            <Ionicons name="call-outline" size={24} color={accentColor} style={styles.icon} />
                            <ThemedText style={styles.contactText}>+233 123 456 789</ThemedText>
                        </View>
                    </ThemedView>

                    <Button
                        title="Report an Issue"
                        onPress={() => console.log("Report issue")}
                        style={styles.reportButton}
                        textStyle={styles.reportButtonText}
                    />
                </ThemedView>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    faqContainer: {},
    faqItem: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        borderRadius: 12,
        padding: 16,
    },
    questionContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {},
    question: {
        fontSize: 16,
        fontWeight: "bold",
        flex: 1,
    },
    answer: {
        fontSize: 14,
        lineHeight: 20,
    },
    contactContainer: {},
    contactItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    contactText: {
        fontSize: 16,
    },
    buttonContent: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },

    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    reportButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderRadius: 8,
    },
    reportButtonText: {},
});
