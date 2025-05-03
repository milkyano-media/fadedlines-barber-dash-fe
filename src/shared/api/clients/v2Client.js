import { ApiClient } from './apiClient';
import { API_BASE_URL, API_V2 } from '../config/apiConfig';

// Create a dedicated client for API v2
const v2Client = new ApiClient(`${API_BASE_URL}${API_V2}`);

export default v2Client;
