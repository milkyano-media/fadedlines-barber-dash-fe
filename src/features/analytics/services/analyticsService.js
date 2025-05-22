import v2Client from '@/api/clients/apiClient';

/**
 * Analytics service for handling analytics-related API calls
 */
export const analyticsService = {
  /**
   * Get customer analytics with pagination and sorting
   * @param {Object} params - Query parameters
   * @param {number} [params.page] - Page number
   * @param {number} [params.size] - Page size
   * @param {string} [params.sortBy] - Sort field (totalConversions, totalRevenue, customerName, lastBookingDate)
   * @param {string} [params.sortDir] - Sort direction (asc, desc)
   * @param {string} [params.startDate] - Start date filter
   * @param {string} [params.endDate] - End date filter
   * @param {string} [params.search] - Search by customer name
   * @returns {Promise<Object>} Response with customer analytics and metadata
   */
  async getCustomerAnalytics(params = {}) {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await v2Client.axiosInstance.get(
        `/customers?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch customer analytics:', error);
      throw error;
    }
  }
};
