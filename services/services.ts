import envService  from '@/services/envService';
// app/services/regionService.ts
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import axios, { AxiosError, AxiosResponse } from 'axios';
import { ParseReturnType, z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { useAuthContext } from '@/components/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = envService.api_url

axios.defaults.baseURL = envService.api_url

export interface Region {
	id: number;
	name: string;
}

export interface Constituency {
	id: number;
	name: string;
}

export const zConstituency = z.object({id:z.string(),name:z.string()})
export const zRegion = z.object({id:z.string(),name:z.string()})

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

export const zUserProfile = z.object({
	name: z.string(),
	email: z.string(),
	phone: z.string(),
	constituency: z.optional(zConstituency),
	area: z.string(),
	region: z.optional(zRegion),
	region_id: z.optional(z.string().or(z.number())),
	constituency_id: z.optional(z.string().or(z.number())),
	email_notifications: z.optional(z.boolean()),
	push_notifications: z.optional(z.boolean()),
})

export const zNewUserProfile = zUserProfile.omit({region:true,constituency:true})

export interface CampaignMessage {
	id: string;
	title: string;
	content: string;
	image_url: string;
	likes_count: number;
	shares_count: number;
	shareable_url: string;
	user: {
		name: string;
	};
	reads: number;
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

export interface Banner {
	id,image_url,title,description
}

export interface WithdrawalRequest {
	amount: number;
}

export const buildApiUrl = (params: `/${string}`, baseUrl = API_BASE_URL) => baseUrl + params;


export const fetchRegions = async (): Promise<Region[]> => {
	try {
		const response = await axios.get(`/regions`);
		return response.data.data;
	} catch (error) {
		console.error('Error fetching regions:', error);
		throw error;
	}
};

export const fetchConstituencies = async (regionId: number): Promise<Constituency[]> => {
	try {
		const response = await axios.get(`/regions/${regionId}/constituencies`);
		return response.data.data;
	} catch (error) {
		console.error('Error fetching constituencies:', error);
		throw error;
	}
};

export const fetchCampaignMessages = async (): Promise<CampaignMessage[]> => {
	// try {
	// 	const response = await axios.get(`/campaign-messages`, {
	// 		headers: { Authorization: `Bearer ${token}` },
	// 	});
	// 	return response.data.data;
	// } catch (error) {
	// 	console.error('Error fetching campaign messages:', error);
	// 	throw error;
	// }

	return await axios.get('/campaign-messages')
};

export const fetchUserProfile = async (token: string): Promise<UserProfile> => {
	try {
		const response = await axios.get(`/user-profile`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		console.log(response.data);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('Error response:', error.response);
			console.error('Error request:', error.request);
			console.error('Error config:', error.config);
		}
		throw error;
	}
};

export const fetchPointsData = async (token: string): Promise<PointsData> => {
	try {
		const response = await axios.get(`/points`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		const data = response.data;

		// Define the type for withdrawal history items
		interface WithdrawalHistoryItem {
			id: number;
			amount: number;
			status: string;
			created_at: string;
		}

		// Validate and sanitize the data
		const sanitizedData: PointsData = {
			balance: typeof data.balance === 'number' ? data.balance : 0,
			withdrawalHistory: Array.isArray(data.withdrawalHistory)
				? data.withdrawalHistory.map((item: WithdrawalHistoryItem) => ({
						id: item.id || 0,
						amount: typeof item.amount === 'number' ? item.amount : parseFloat(item.amount) || 0,
						status: item.status || 'Unknown',
						created_at: item.created_at || new Date().toISOString(),
				  }))
				: [],
		};

		return sanitizedData;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			if (error.response?.status === 404) {
				console.error('Points endpoint not found. The API might not be implemented yet.');
				throw new Error('Points feature is not available at the moment. Please try again later.');
			} else {
				console.error('Error fetching points data:', error.message);
				throw new Error(`Failed to fetch points data: ${error.message}`);
			}
		} else {
			console.error('Unexpected error:', error);
			throw new Error('An unexpected error occurred while fetching points data');
		}
	}
};

export const fetchWithdrawalRequests = async (token: string): Promise<WithdrawalRequest[]> => {
	try {
		const response = await axios.get(`/reward-withdrawals`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data.data;
	} catch (error) {
		console.error('Error fetching withdrawal requests:', error);
		throw error;
	}
};

export const updateWithdrawalStatus = async (token: string, withdrawalId: number, status: 'approved' | 'rejected', rejectionReason?: string): Promise<void> => {
	try {
		await axios.put(
			`/reward-withdrawals/${withdrawalId}`,
			{ status, rejection_reason: rejectionReason },
			{ headers: { Authorization: `Bearer ${token}` } }
		);
	} catch (error) {
		console.error('Error updating withdrawal status:', error);
		throw error;
	}
};

export const submitWithdrawalRequest = async (token: string, amount: number): Promise<void> => {
	try {
		await axios.post(`/reward-withdrawals`, { amount }, { headers: { Authorization: `Bearer ${token}` } });
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('Error submitting withdrawal request:', error.message);
			throw new Error(`Failed to submit withdrawal request: ${error.message}`);
		} else {
			console.error('Unexpected error:', error);
			throw new Error('An unexpected error occurred while submitting the withdrawal request');
		}
	}
};

export const fetchUserBalance = async (): Promise<number> => {
	// try {
	// 	console.log('Fetching user balance with token:', token);
	// 	const response = await axios.get(`/user-balance`, {
	// 		headers: { Authorization: `Bearer ${token}` },
	// 	});
	// 	console.log('User balance response:', response.data);
	// 	return response.data.balance;
	// } catch (error) {
	// 	if (axios.isAxiosError(error)) {
	// 		console.error('Error fetching user balance:', error.response?.status, error.response?.data);
	// 	} else {
	// 		console.error('Unexpected error:', error);
	// 	}
	// 	throw error;
	// }
	return axios.get(buildApiUrl('/user-balance'))
};

export const zPointTransaction = z.object({
	userId: z.string(),
	messageId: z.string(),
	points: z.number().optional(),
});



export type SWROptions = Parameters<typeof useSWR>['2'];

export const zPointWithdrawals = z.object({
	balance: z.number(),
	withdrawalHistory: z
		.object({
			id: z
				.string()
				.or(z.number())
				.transform(d => d + ''),
			amount: z
				.number()
				.or(z.string())
				.transform(d => Number(d ?? 0)),
			status: z.string(),
			created_at: z
				.date()
				.or(z.string())
				.transform(d => new Date(d).toISOString()),
			update_at: z.optional(
				z
					.date()
					.or(z.string())
					.transform(d => new Date(d).toISOString())
			)
		})
		.array()
});

export const useMxPointTransaction = (data: typeof zPointTransaction._type, options?: SWROptions) => {
	const axios = useApi();
	const req = useSWR(
		{ url: 'point-transactions', data },
		({ url, data }) => {
			console.log({ data });
			const _data = zPointTransaction
				.transform((d) => ({
					point: d.points, //'required|integer',
					transaction_type: 'read_message', //'required|string',
					related_id: d.messageId, //'nullable|integer',
					related_type: 'campaign_message', //'nullable|string',
					user_id: d.userId,
				}))
				.parse(data);

			return axios.axiosInstance
				.post(buildApiUrl(`/point-transactions`), _data)
				.then((r) => r.data);
		},
		options
	);
	return req;
};

export const useApi = () => {
	const auth = useAuthContext();

	const axiosInstance = axios.create();

	axiosInstance.interceptors.request.use(req=>{
		if (!req.headers.skipAuthorization){
			req.headers.Authorization = 'Bearer '+auth.token
		}
		return req
	})



	
	return {axiosInstance,
		getRegions: (options?:SWROptions)=>useSWR<Region[],AxiosError>('/regions?include=constituencies',(key)=> axiosInstance.get(key).then(r=>r.data.data),options),
		getConstituencies: (options?:SWROptions)=>useSWR<Constituency[],AxiosError>('/constituencies',(key)=> axiosInstance.get(key).then(r=>r.data.data),options),
		getCampaignsConstituency: (options?:SWROptions)=>useSWR<CampaignMessage[],AxiosError>('/campaign-messages',()=> axiosInstance.get('/campaign-messages?sort=-created_at&include=user_liked&filter[constituency_id]='+auth.user?.constituency_id).then(r=>r.data.data),options),
		getCampaignsRegional: (options?:SWROptions)=>useSWR<CampaignMessage[],AxiosError>('/campaign-messages/regional',()=> axiosInstance.get('/campaign-messages?sort=-created_at&include=user_liked&filter[regional]').then(r=>r.data.data),options),
		getCampaignsNational: (options?:SWROptions)=>useSWR<CampaignMessage[],AxiosError>('/campaign-messages/national',()=> axiosInstance.get('/campaign-messages?sort=-created_at&include=user_liked&filter[national]').then(r=>r.data.data),options),
		getUserBalance: (options?:SWROptions)=>useSWR<{balance:number},AxiosError>('/user-balance',(key)=> axiosInstance.get(key).then(r=>r.data),options),
		getWithdrawals: (options?:SWROptions)=>useSWR<any,AxiosError>('/reward-withdrawals',(key)=>axiosInstance.get(key).then(r=>r.data),options),
		mxWithdrawals: (options?:SWROptions)=> useSWRMutation('/reward-withdrawals' , (url,{arg}:{arg:{amount:Number}}) =>
			axiosInstance
				.post(url,arg)
				.then(d => zPointWithdrawals.parse(d.data))
		),
		getPoints: (options?:SWROptions)=>useSWR<PointsData,AxiosError>('/points',(key)=>axiosInstance.get(key).then(r=>r.data),options),
		getUserProfile: (options?:SWROptions)=>useSWR<UserProfile,AxiosError>('/user-profile',(key)=>axiosInstance.get(key).then(r=>r.data.data),options),
		mxUpdateUserProfile:(options?:SWROptions)=>useSWRMutation<UserProfile&{token:string|undefined},AxiosError>('/user-profile',(url,{arg}:{arg:typeof zNewUserProfile._type})=>axiosInstance.patch(url,arg) as any,options) ,
		getConstituencyBanners: (options?:SWROptions)=>useSWR<Banner[],AxiosError>(`/banners?filter[bannerable_id]=${auth.user?.constituency_id}&filter[bannerable_type]=Constituency`,(key)=>axiosInstance.get(key).then(r=>r.data.data),options),
		getRegionBanners: (options?:SWROptions)=>useSWR<Banner[],AxiosError>(`/banners?filter[bannerable_id]=${auth.user?.region_id}&filter[bannerable_type]=Region`,(key)=>axiosInstance.get(key).then(r=>r.data.data),options),
		getNationalBanners: (options?:SWROptions)=>useSWR<Banner[],AxiosError>(`/banners?filter[bannerable_id]=null&filter[bannerable_type]=null`,(key)=>axiosInstance.get(key).then(r=>r.data.data),options),
	};
	
};


