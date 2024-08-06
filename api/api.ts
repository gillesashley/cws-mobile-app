
import axios from "axios";
export const API_BASE_URL = "http://localhost:8080/api";
export const Api = () => {
    return axios.create({
        baseURL : API_BASE_URL,
        timeout: 80000,
    })
}