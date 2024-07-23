import React from "react";
import { ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/Button";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaView } from "react-native-safe-area-context";

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => (
  <ThemedView style={styles.faqItem}>
    <ThemedText type="subtitle">{question}</ThemedText>
    <ThemedText>{answer}</ThemedText>
  </ThemedView>
);

export default function HelpScreen() {
  const backgroundColor = useThemeColor({}, "background");
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={["top"]}
    >
      <ScrollView style={styles.scrollView}>
        <ThemedView style={styles.container}>
          <ThemedText type="title">Help & Support</ThemedText>

          <ThemedView style={styles.faqContainer}>
            <ThemedText type="subtitle">Frequently Asked Questions</ThemedText>
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

          <ThemedView style={styles.contactContainer}>
            <ThemedText type="subtitle">Contact Support</ThemedText>
            <ThemedText>
              If you need further assistance, please contact our support team:
            </ThemedText>
            <ThemedText>Email: support@campaignwithus.com</ThemedText>
            <ThemedText>Phone: +233 123 456 789</ThemedText>
          </ThemedView>

          <Button
            title="Report an Issue"
            onPress={() => console.log("Report issue")}
            style={styles.reportButton}
          />
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  faqContainer: {
    marginVertical: 16,
  },
  faqItem: {
    marginVertical: 8,
  },
  contactContainer: {
    marginVertical: 16,
  },
  reportButton: {
    marginTop: 16,
  },
});
