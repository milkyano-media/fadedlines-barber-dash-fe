// src/features/dashboard-home/dashboardService.js
import v2Client from "@/api/clients/apiClient";

/**
 * Dashboard service for handling dashboard-related API calls
 */
export const dashboardService = {
    /**
     * Get dashboard summary statistics
     * @param {Object} params - Query parameters
     * @param {string} [params.startDate] - Start date filter
     * @param {string} [params.endDate] - End date filter
     * @returns {Promise<Object>} Response with dashboard summary
     */
    async getDashboardSummary(params = {}) {
        try {
            // Build query parameters
            const queryParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString());
                }
            });

            const response = await v2Client.axiosInstance.get(`/analytics/dashboard/summary?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch dashboard summary:", error);
            throw error;
        }
    },

    /**
     * Get recent activity
     * @param {Object} params - Query parameters
     * @param {number} [params.limit] - Number of recent activities to fetch
     * @returns {Promise<Object>} Response with recent activity
     */
    async getRecentActivity(params = {}) {
        try {
            // Build query parameters
            const queryParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString());
                }
            });

            const response = await v2Client.axiosInstance.get(
                `/analytics/dashboard/recent-activity?${queryParams.toString()}`,
            );
            return response.data;
        } catch (error) {
            console.error("Failed to fetch recent activity:", error);
            throw error;
        }
    },

    /**
     * Get top performers
     * @param {Object} params - Query parameters
     * @param {string} [params.startDate] - Start date filter
     * @param {string} [params.endDate] - End date filter
     * @param {number} [params.limit] - Number of top performers to fetch
     * @returns {Promise<Object>} Response with top performers
     */
    async getTopPerformers(params = {}) {
        try {
            // Build query parameters
            const queryParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString());
                }
            });

            const response = await v2Client.axiosInstance.get(
                `/analytics/dashboard/top-performers?${queryParams.toString()}`,
            );
            return response.data;
        } catch (error) {
            console.error("Failed to fetch top performers:", error);
            throw error;
        }
    },
};

export default dashboardService;
