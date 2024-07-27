import { ThemedText } from "@/components/ThemedText";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, TextStyle, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

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
  const textColor = useThemeColor({}, "background");
  const animation = useSharedValue(0);

  useEffect(() => {
    animation.value = withSpring(1, { damping: 12, stiffness: 90 });
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: animation.value,
    transform: [{ translateY: (1 - animation.value) * 20 }],
  }));

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
    <Animated.View style={[styles.container, containerStyle]}>
      <LinearGradient
        colors={["#4c669f", "#3b5998", "#192f6a"]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="cash-outline" size={32} color={textColor} />
        </View>
        <ThemedText
          type="subtitle"
          style={[styles.title, { color: textColor }]}
        >
          Request Withdrawal
        </ThemedText>
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
          style={styles.input}
          labelStyle={{ color: textColor, marginBottom: 6 } as TextStyle}
        />
        {error ? (
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        ) : null}
        <ThemedText style={[styles.maxAmountText, { color: textColor }]}>
          Maximum withdrawal: ₵{maxAmount.toFixed(2)}
        </ThemedText>
        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={onCancel}
            style={[
              styles.cancelButton,
              { backgroundColor: "rgba(255,255,255,0.3)" },
            ]}
            textStyle={{ color: textColor }}
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
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  gradient: {
    padding: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#0200FF",
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderColor: "rgba(255,255,255,0.3)",
    marginBottom: 12,
  },
  errorText: {
    color: "#FF6B6B",
    marginTop: 4,
    textAlign: "center",
  },
  maxAmountText: {
    marginTop: 8,
    fontStyle: "italic",
    textAlign: "center",
    opacity: 0.8,
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
    backgroundColor: "#4CAF50",
  },
  loader: {
    marginTop: 16,
  },
});

export default WithdrawalForm;
