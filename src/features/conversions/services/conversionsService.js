import v2Client from '@/api/clients/v2Client';

/**
 * Conversions service for handling conversion-related API calls
 */
export const conversionsService = {
  /**
   * Get conversions list with filtering options
   * @param {Object} params - Query parameters
   * @param {number} [params.page] - Page number
   * @param {number} [params.size] - Page size
   * @param {string} [params.search] - Search term
   * @param {string} [params.influenceLevel] - Influence level filter
   * @param {string} [params.startDate] - Start date filter
   * @param {string} [params.endDate] - End date filter
   * @param {string} [params.teamMemberId] - Team member ID filter
   * @returns {Promise<import('../types/conversionTypes').ConversionsResponse>}
   */
  async getConversions(params = {}) {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await v2Client.axiosInstance.get(`/conversions?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch conversions:', error);
      throw error;
    }
  },

  /**
   * Get details of a specific conversion
   * @param {string} conversionSequenceId - Conversion sequence ID
   * @returns {Promise<import('../types/conversionTypes').ConversionDetailResponse>}
   */
  async getConversionDetails(conversionSequenceId) {
    try {
      const response = await v2Client.axiosInstance.get(`/conversions/${conversionSequenceId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch conversion details:', error);
      throw error;
    }
  },

  /**
   * Get conversions summary statistics
   * @param {string} [startDate] - Start date filter
   * @param {string} [endDate] - End date filter
   * @returns {Promise<import('../types/conversionTypes').ConversionsSummaryResponse>}
   */
  async getConversionsSummary(startDate, endDate) {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const response = await v2Client.axiosInstance.get(`/conversions/summary?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch conversions summary:', error);
      throw error;
    }
  }
};
