import v2Client from '@/api/clients/apiClient';

/**
 * Service for sync and ETL operations
 */
export const syncEtlService = {
  /**
   * Get sync status information
   * @returns {Promise<Object>} Sync status data
   */
  async getSyncStatus() {
    try {
      const response = await v2Client.axiosInstance.get('/sync');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch sync status:', error);
      throw error;
    }
  },

  /**
   * Get ETL status information
   * @returns {Promise<Object>} ETL status data
   */
  async getEtlStatus() {
    try {
      const response = await v2Client.axiosInstance.get('/etl');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch ETL status:', error);
      throw error;
    }
  },

  /**
   * Sync all data from Square (customers, team members, bookings)
   * @returns {Promise<Object>} Sync results
   */
  async syncAll() {
    try {
      const response = await v2Client.axiosInstance.post('/sync');
      return response.data;
    } catch (error) {
      console.error('Failed to sync all data:', error);
      throw error;
    }
  },

  /**
   * Sync only customers from Square
   * @returns {Promise<Object>} Sync results
   */
  async syncCustomers() {
    try {
      const response = await v2Client.axiosInstance.post('/sync/customers');
      return response.data;
    } catch (error) {
      console.error('Failed to sync customers:', error);
      throw error;
    }
  },

  /**
   * Sync only team members from Square
   * @returns {Promise<Object>} Sync results
   */
  async syncTeams() {
    try {
      const response = await v2Client.axiosInstance.post('/sync/teams');
      return response.data;
    } catch (error) {
      console.error('Failed to sync teams:', error);
      throw error;
    }
  },

  /**
   * Sync booking events from Square
   * @returns {Promise<Object>} Sync results
   */
  async syncBookingEvents() {
    try {
      const response = await v2Client.axiosInstance.post('/sync/booking-events');
      return response.data;
    } catch (error) {
      console.error('Failed to sync booking events:', error);
      throw error;
    }
  },

  /**
   * Process conversions ETL
   * @returns {Promise<Object>} ETL processing results
   */
  async processConversions() {
    try {
      // Create a custom axios instance without timeout for long-running ETL process
      const response = await v2Client.axiosInstance.post('/etl/conversions', {}, {
        timeout: 0 // No timeout for this request
      });
      return response.data;
    } catch (error) {
      console.error('Failed to process conversions ETL:', error);
      throw error;
    }
  }
};

export default syncEtlService;
