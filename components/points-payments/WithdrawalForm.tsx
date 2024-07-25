import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface WithdrawalFormProps {
  onSubmit: (amount: number) => void;
  onCancel: () => void;
  maxAmount: number;
}

const WithdrawalForm: React.FC<WithdrawalFormProps> = ({ onSubmit, onCancel, maxAmount }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

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
      />
      {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}
      <ThemedText style={styles.maxAmountText}>
        Maximum withdrawal: ₵{maxAmount.toFixed(2)}
      </ThemedText>
      <View style={styles.buttonContainer}>
        <Button title="Cancel" onPress={onCancel} style={styles.cancelButton} />
        <Button title="Submit" onPress={handleSubmit} style={styles.submitButton} />
      </View>
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
});

export default WithdrawalForm;