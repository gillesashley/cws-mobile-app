
import axios from "axios";
// export const API_BASE_URL = "http://localhost:8080/api";
export const API_BASE_URL = "https://campaignwithus.com/public/api";
export const Api = () => {
    return axios.create({
        baseURL : API_BASE_URL,
        timeout: 80000,
    })
}