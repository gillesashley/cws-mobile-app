// app/services/regionService.ts

import { API_BASE_URL } from "@/api/api";
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
  area: string;
  region: Region | null;
  email_notifications: boolean;
  push_notifications: boolean;
}

export interface CampaignMessage {
  id: string;
  title: string;
  content: string;
  user: {
    name: string;
  };
  likes_count: number;
  shares_count: number;
  reads: number;
  image_url: string;
  shareable_url: string;
}

export interface PointsData {
  balance: number;
  withdrawalHistory: Array<{
    id: number;
    amount: number;
    status: string;
    created_at: string;
  }>;
}

export interface WithdrawalRequest {
  amount: number;
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

export const fetchCampaignMessages = async (
  token: string
): Promise<CampaignMessage[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/campaign-messages`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching campaign messages:", error);
    throw error;
  }
};

export const fetchUserProfile = async (token: string): Promise<UserProfile> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user-profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error response:", error.response);
      console.error("Error request:", error.request);
      console.error("Error config:", error.config);
    }
    throw error;
  }
};

export const fetchPointsData = async (token: string): Promise<PointsData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/points`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching points data:", error);
    throw error;
  }
};

export const submitWithdrawalRequest = async (
  token: string,
  amount: number
): Promise<void> => {
  try {
    await axios.post(
      `${API_BASE_URL}/reward-withdrawals`,
      { amount },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error("Error submitting withdrawal request:", error);
    throw error;
  }
};

export const fetchWithdrawalRequests = async (
  token: string
): Promise<WithdrawalRequest[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reward-withdrawals`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching withdrawal requests:", error);
    throw error;
  }
};

export const updateWithdrawalStatus = async (
  token: string,
  withdrawalId: number,
  status: "approved" | "rejected",
  rejectionReason?: string
): Promise<void> => {
  try {
    await axios.put(
      `${API_BASE_URL}/reward-withdrawals/${withdrawalId}`,
      { status, rejection_reason: rejectionReason },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error("Error updating withdrawal status:", error);
    throw error;
  }
};
