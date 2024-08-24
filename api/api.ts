import axios from 'axios';
import envService from '@/services/envService';
export const API_BASE_URL = envService.api_url;
export const Api = () => {
	return axios.create({
		baseURL: API_BASE_URL,
		timeout: 80000
	});
};
