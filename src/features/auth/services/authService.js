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
      const response = await v2Client.post('/auth/login', credentials);
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
    // Don't redirect here - let React Router handle it
    // window.location.href = '/login';
  },

  /**
   * Get current user
   * @returns {Object|null} Current user data
   */
  getCurrentUser() {
    try {
      const userData = localStorage.getItem(USER_KEY);
      
      // Check for invalid string values
      if (!userData || userData === 'undefined' || userData === 'null') {
        return null;
      }
      
      const parsed = JSON.parse(userData);
      
      // Validate the parsed data is an object with required fields
      if (parsed && typeof parsed === 'object' && parsed.id && parsed.email) {
        return parsed;
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      // Clear invalid data
      localStorage.removeItem(USER_KEY);
      return null;
    }
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
    const token = this.getToken();
    
    // Check for invalid token values
    if (!token || typeof token !== 'string' || 
        token === 'undefined' || token === 'null' || token === '') {
      return false;
    }
    
    // Basic JWT structure validation
    const parts = token.split('.');
    if (parts.length !== 3 || !parts.every(part => part.length > 0)) {
      // Invalid token format - clear it
      localStorage.removeItem(TOKEN_KEY);
      return false;
    }
    
    // Also check if we have valid user data
    const user = this.getCurrentUser();
    return !!user;
  }
};
