import axios from "axios";
import { API_BASE_URL, API_V2 } from "../config/apiConfig";

class ApiClient {
    constructor(baseURL) {
        this.axiosInstance = axios.create({
            baseURL,
            headers: {
                "Content-Type": "application/json",
            },
            // timeout: 90000 // 30 seconds
        });

        // Request interceptor
        this.axiosInstance.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem("auth_token");
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            },
        );

        // Response interceptor
        this.axiosInstance.interceptors.response.use(
            (response) => {
                return response;
            },
            (error) => {
                // Process error responses
                console.error("API request failed:", error);

                // Handle auth errors (e.g., token expired)
                if (error.response && error.response.status === 401) {
                    console.error("Authentication error:", error);
                    localStorage.removeItem("auth_token");
                    localStorage.removeItem("user_data");
                    // Don't redirect here - let React Router handle it
                    // window.location.href = '/login';
                }

                return Promise.reject(error);
            },
        );
    }

    // HTTP methods
    get(url, config) {
        return this.axiosInstance.get(url, config);
    }

    post(url, data, config) {
        return this.axiosInstance.post(url, data, config);
    }

    put(url, data, config) {
        return this.axiosInstance.put(url, data, config);
    }

    patch(url, data, config) {
        return this.axiosInstance.patch(url, data, config);
    }

    delete(url, config) {
        return this.axiosInstance.delete(url, config);
    }
}

const v2Client = new ApiClient(`${API_BASE_URL}${API_V2}`);

export default v2Client;
