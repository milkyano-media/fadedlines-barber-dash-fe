import v2Client from '@/api/clients/apiClient';

/**
 * Barber analytics service for handling barber-related API calls
 */
export const barberAnalyticsService = {
  /**
   * Get barber analytics with pagination and sorting
   * @param {Object} params - Query parameters
   * @param {number} [params.page] - Page number
   * @param {number} [params.size] - Page size
   * @param {string} [params.sortBy] - Sort field (default, displayOrder, totalConversions, totalRevenue, barberName, lastBookingDate, employmentType)
   * @param {string} [params.sortDir] - Sort direction (asc, desc)
   * @param {string} [params.startDate] - Start date filter
   * @param {string} [params.endDate] - End date filter
   * @param {string} [params.search] - Search by barber name
   * @param {string} [params.employmentType] - Filter by employment type (EMPLOYEE, CHAIR_RENTAL)
   * @returns {Promise<Object>} Response with barber analytics and metadata
   */
  async getBarberAnalytics(params = {}) {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await v2Client.axiosInstance.get(
        `/analytics/barbers?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Failed to fetch barber analytics:', error);
      throw error;
    }
  }
};
