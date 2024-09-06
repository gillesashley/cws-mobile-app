import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Input } from "@/components/ui/Input";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useApi } from "@/services/services";
import { Picker } from "@react-native-picker/picker";
import React from "react";
import { Control, Controller, useController } from "react-hook-form";
import { StyleSheet, Text } from "react-native";

interface Profile {
  constituency?: { name: string } | null;
  region?: { name: string } | null;
  region_id;
  constituency_id;
}

interface LocationCardProps {
  control: Control<Profile>;
}

export const LocationCard: React.FC<LocationCardProps> = ({ control }) => {
  const surfaceColor = useThemeColor({}, "surface");
  const textColor = useThemeColor({}, "text");
  const api = useApi();
  const { data: regions } = api.getRegions();
  const { data: constituencies } = api.getConstituencies();

  return (
    <ThemedView style={[styles.card, { backgroundColor: surfaceColor }]}>
      <ThemedText style={styles.sectionTitle}>Location</ThemedText>
      <Controller
        control={control}
        name="region_id"
        render={({ field }) => (
          <Picker onValueChange={field.onChange} selectedValue={field.value}>
            {regions?.map(ct => (
              <Picker.Item key={ct.id} label={ct.name} value={ct.id} />
            ))}
          </Picker>
        )}
      />

      <Text>Contituency</Text>
      <Controller
        control={control}
        name="constituency_id"
        render={({ field }) => (
          <Picker onValueChange={field.onChange} selectedValue={field.value}>
            {constituencies?.filter(ct=>ct.region_id===control._formValues.region_id)?.map(ct => (
              <Picker.Item key={ct.id} label={ct.name} value={ct.id} />
            ))}
          </Picker>
        )}
      />
      <Text>Region</Text>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16
  }
});
