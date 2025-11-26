import v2Client from "@/api/clients/apiClient";

/**
 * Campaigns service for handling campaign-related API calls
 */
export const campaignsService = {
    /**
     * Get campaigns list with pagination and sorting
     * @param {Object} params - Query parameters
     * @param {number} [params.page] - Page number
     * @param {number} [params.size] - Page size
     * @param {string} [params.sortBy] - Sort field (conversions, revenue, name)
     * @param {string} [params.sortDir] - Sort direction (asc, desc)
     * @returns {Promise<Object>} Response with campaigns and metadata
     */
    async getCampaigns(params = {}) {
        try {
            // Build query parameters
            const queryParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString());
                }
            });

            const response = await v2Client.axiosInstance.get(`/analytics/campaigns?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch campaigns:", error);
            throw error;
        }
    },
};
