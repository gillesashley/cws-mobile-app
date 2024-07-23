// app/services/regionService.ts

import { API_BASE_URL } from "@/config/api";
import axios from "axios";

export interface Region {
  id: number;
  name: string;
}

export interface Constituency {
  id: number;
  name: string;
}

export const fetchRegions = async (): Promise<Region[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/regions`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching regions:", error);
    throw error;
  }
};

export const fetchConstituencies = async (
  regionId: number
): Promise<Constituency[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/regions/${regionId}/constituencies`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching constituencies:", error);
    throw error;
  }
};
