import { API_BASE_URL } from "@/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export const fetchAnalyticsData = async () => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    const response = await axios.get(`${API_BASE_URL}/analytics`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    throw error;
  }
};
