import v2Client from '@/api/clients/apiClient';

export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'user_data';

/**
 * Auth service for handling authentication operations
 */
export const authService = {
  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Login response
   */
  async login(credentials) {
    try {
      const response = await v2Client.axiosInstance.post('/auth/login', credentials);
      const data = response.data;
      
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      }
      
      return data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    // Redirect to login page
    window.location.href = '/login';
  },

  /**
   * Get current user
   * @returns {Object|null} Current user data
   */
  getCurrentUser() {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Get token
   * @returns {string|null} Authentication token
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    return !!this.getToken();
  }
};
