import { Input } from "@/components/ui/Input";
import {
  Constituency,
  fetchConstituencies,
  fetchRegions,
  Region,
} from "@/services/services";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";

interface LocationStepProps {
  onComplete: (data: {
    regionId: string;
    constituencyId: string;
    area: string;
  }) => void;
  initialData: { regionId: string; constituencyId: string; area: string };
}

export default function LocationStep({
  onComplete,
  initialData,
}: LocationStepProps) {
  const [regions, setRegions] = useState<Region[]>([]);
  const [constituencies, setConstituencies] = useState<Constituency[]>([]);
  const [regionId, setRegionId] = useState(initialData.regionId);
  const [constituencyId, setConstituencyId] = useState(
    initialData.constituencyId
  );
  const [area, setArea] = useState(initialData.area);

  useEffect(() => {
    loadRegions();
  }, []);

  useEffect(() => {
    if (regionId) {
      loadConstituencies(regionId);
    }
  }, [regionId]);

  const loadRegions = async () => {
    try {
      const fetchedRegions = await fetchRegions();
      setRegions(fetchedRegions);
    } catch (error) {
      console.error("Failed to load regions:", error);
      Alert.alert("Error", "Failed to load regions. Please try again.");
    }
  };

  const loadConstituencies = async (selectedRegionId: string) => {
    try {
      const fetchedConstituencies = await fetchConstituencies(
        Number(selectedRegionId)
      );
      setConstituencies(fetchedConstituencies);
    } catch (error) {
      console.error("Failed to load constituencies:", error);
      Alert.alert("Error", "Failed to load constituencies. Please try again.");
    }
  };

  const handleNext = () => {
    onComplete({ regionId, constituencyId, area });
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={regionId}
        onValueChange={(itemValue) => setRegionId(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Select Region" value="" />
        {regions.map((region) => (
          <Picker.Item
            key={region.id}
            label={region.name}
            value={region.id.toString()}
          />
        ))}
      </Picker>
      <Picker
        selectedValue={constituencyId}
        onValueChange={(itemValue) => setConstituencyId(itemValue)}
        style={styles.picker}
        enabled={!!regionId}
      >
        <Picker.Item label="Select Constituency" value="" />
        {constituencies.map((constituency) => (
          <Picker.Item
            key={constituency.id}
            label={constituency.name}
            value={constituency.id.toString()}
          />
        ))}
      </Picker>
      <Input
        label="Area"
        value={area}
        onChangeText={setArea}
        placeholder="Enter your specific area"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  picker: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 20,
  },
});
