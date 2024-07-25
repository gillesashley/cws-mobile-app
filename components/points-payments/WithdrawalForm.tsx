import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

interface WithdrawalFormProps {
  onSubmit: (amount: number) => void;
  onCancel: () => void;
  maxAmount: number;
  isSubmitting: boolean;
}

const WithdrawalForm: React.FC<WithdrawalFormProps> = ({
  onSubmit,
  onCancel,
  maxAmount,
  isSubmitting,
}) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const textColor = useThemeColor({}, "text");

  const handleSubmit = () => {
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount");
    } else if (numAmount > maxAmount) {
      setError(`Maximum withdrawal amount is ₵${maxAmount.toFixed(2)}`);
    } else {
      onSubmit(numAmount);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle">Request Withdrawal</ThemedText>
      <Input
        label="Amount (₵)"
        value={amount}
        onChangeText={(text) => {
          setAmount(text);
          setError("");
        }}
        keyboardType="numeric"
        placeholder="Enter amount"
        editable={!isSubmitting}
      />
      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
      <ThemedText style={styles.maxAmountText}>
        Maximum withdrawal: ₵{maxAmount.toFixed(2)}
      </ThemedText>
      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          onPress={onCancel}
          style={styles.cancelButton}
          disabled={isSubmitting}
        />
        <Button
          title={isSubmitting ? "Submitting..." : "Submit"}
          onPress={handleSubmit}
          style={styles.submitButton}
          disabled={isSubmitting}
        />
      </View>
      {isSubmitting && (
        <ActivityIndicator
          size="small"
          color={textColor}
          style={styles.loader}
        />
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  errorText: {
    color: "red",
    marginTop: 4,
  },
  maxAmountText: {
    marginTop: 8,
    fontStyle: "italic",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
  },
  loader: {
    marginTop: 16,
  },
});

export default WithdrawalForm;
