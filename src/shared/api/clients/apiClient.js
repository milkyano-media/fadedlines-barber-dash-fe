import axios from 'axios';
import { API_BASE_URL, API_V1, REQUEST_TIMEOUT } from '../config/apiConfig';

class ApiClient {
  constructor(baseURL) {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: REQUEST_TIMEOUT
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

  // GET request
  async get(endpoint, config) {
    try {
      const response = await this.axiosInstance.get(endpoint, config);
      return response.data;
    } catch (error) {
      console.error(`GET request to ${endpoint} failed:`, error);
      throw error;
    }
  }

  // POST request
  async post(endpoint, data, config) {
    try {
      const response = await this.axiosInstance.post(endpoint, data, config);
      return response.data;
    } catch (error) {
      console.error(`POST request to ${endpoint} failed:`, error);
      throw error;
    }
  }

  // PUT request
  async put(endpoint, data, config) {
    try {
      const response = await this.axiosInstance.put(endpoint, data, config);
      return response.data;
    } catch (error) {
      console.error(`PUT request to ${endpoint} failed:`, error);
      throw error;
    }
  }

  // DELETE request
  async delete(endpoint, config) {
    try {
      const response = await this.axiosInstance.delete(endpoint, config);
      return response.data;
    } catch (error) {
      console.error(`DELETE request to ${endpoint} failed:`, error);
      throw error;
    }
  }

  // PATCH request
  async patch(endpoint, data, config) {
    try {
      const response = await this.axiosInstance.patch(endpoint, data, config);
      return response.data;
    } catch (error) {
      console.error(`PATCH request to ${endpoint} failed:`, error);
      throw error;
    }
  }
}

// Export the default client for API v1
const apiClient = new ApiClient(`${API_BASE_URL}${API_V1}`);

export default apiClient;
export { ApiClient };
