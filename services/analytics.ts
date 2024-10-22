import { API_BASE_URL } from "@/api/api";
import axios from "axios";

export interface AnalyticsData {
    postsShared: number;
    postsSharedChange: number;
    postLikes: number;
    postLikesChange: number;
    postsRead: number;
    postsReadChange: number;
    totalPoints: number | string;
    totalPointsChange: number;
    overviewData: number[];
    popularPost: {
        title: string;
        reads: number;
        likes: number;
        shares: number;
        imageUrl: string | null;
    };
}

export const fetchAnalyticsData = async (token: string): Promise<AnalyticsData> => {
    try {
        const response = await axios.get<AnalyticsData>(`${API_BASE_URL}/analytics`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Received analytics data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching analytics data:", error);
        throw error;
    }
};
