import * as Updates from "expo-updates";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export function ExpoErrorBoundary({ children }: ErrorBoundaryProps) {
  const [error, setError] = useState<Error | null>(null);


  const handleError = (error: Error) => {
    console.error("Caught error:", error);
    setError(error);
  };

  const resetError = async () => {
    setError(null);
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      }
    } catch (e) {
      console.error("Failed to check for updates:", e);
    }
  };

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Oops!</Text>
        <Text style={styles.text}>
          Something went wrong. We're sorry for the inconvenience.
        </Text>
        <Text style={styles.errorText}>{error.toString()}</Text>
        <Button title="Try again" onPress={resetError} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { onError: handleError } as any);
        }
        return child;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    color: "red",
    marginBottom: 20,
  },
});
