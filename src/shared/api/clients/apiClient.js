import axios from 'axios';
import { API_BASE_URL, API_V1, API_V2 } from '../config/apiConfig';

class ApiClient {
  constructor(baseURL) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 seconds
    });

    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // Process error responses
        console.error('API request failed:', error);

        // Handle auth errors (e.g., token expired)
        if (error.response && error.response.status === 401) {
          // You might want to redirect to login or refresh token
          console.error('Authentication error:', error);
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }

        return Promise.reject(error);
      }
    );
  }
}

const v2Client = new ApiClient(`${API_BASE_URL}${API_V2}`);

export default v2Client;
