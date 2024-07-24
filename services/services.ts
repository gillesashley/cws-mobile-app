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

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  constituency: Constituency | null;
  region: Region | null;
  email_notifications: boolean;
  push_notifications: boolean;
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

export const fetchUserProfile = async (token: string): Promise<UserProfile> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user-profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
