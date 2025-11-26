import v2Client from "@/api/clients/apiClient";

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
     * @param {string} [params.sort] - Sort order (bookingDate_desc, bookingDate_asc, createdAt_desc, createdAt_asc)
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
            console.error("Failed to fetch conversions:", error);
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
            console.error("Failed to fetch conversion details:", error);
            throw error;
        }
    },

    /**
     * Get conversions summary statistics
     * @param {string} [startDate] - Start date filter
     * @param {string} [endDate] - End date filter
     * @param {string} [source] - Source filter (website or non-web)
     * @returns {Promise<import('../types/conversionTypes').ConversionsSummaryResponse>}
     */
    async getConversionsSummary(startDate, endDate, source) {
        try {
            // Build query parameters
            const queryParams = new URLSearchParams();
            if (startDate) queryParams.append("startDate", startDate);
            if (endDate) queryParams.append("endDate", endDate);
            if (source) queryParams.append("source", source);

            const url = `/conversions/summary?${queryParams.toString()}`;

            const response = await v2Client.axiosInstance.get(url);

            if (!response.data || !response.data.data) {
                // Return a safe default structure
                return {
                    data: {
                        totalConversions: 0,
                        adInfluencedCount: 0,
                        averageInfluenceScore: 0,
                        totalRevenue: 0,
                        campaignBreakdown: [],
                        influenceLevelBreakdown: [],
                    },
                    status: "OK",
                    message: "No data available",
                };
            }

            return response.data;
        } catch (error) {
            // Return a safe default structure in case of error
            return {
                data: {
                    totalConversions: 0,
                    adInfluencedCount: 0,
                    averageInfluenceScore: 0,
                    totalRevenue: 0,
                    campaignBreakdown: [],
                    influenceLevelBreakdown: [],
                },
                status: "ERROR",
                message: error.message || "Failed to fetch summary data",
            };
        }
    },

    /**
     * Get comparison data between two date ranges
     * @param {Object} currentPeriod - Current period date range
     * @param {string} currentPeriod.startDate - Start date of current period
     * @param {string} currentPeriod.endDate - End date of current period
     * @param {Object} comparisonPeriod - Comparison period date range
     * @param {string} comparisonPeriod.startDate - Start date of comparison period
     * @param {string} comparisonPeriod.endDate - End date of comparison period
     * @param {string} [source] - Source filter (website or non-web)
     * @returns {Promise<{current: Object, previous: Object}>}
     */
    async getComparisonData(currentPeriod, comparisonPeriod, source) {
        try {
            // Fetch data for both periods in parallel
            const [currentData, previousData] = await Promise.all([
                this.getConversionsSummary(currentPeriod.startDate, currentPeriod.endDate, source),
                this.getConversionsSummary(comparisonPeriod.startDate, comparisonPeriod.endDate, source),
            ]);

            return {
                current: currentData.data,
                previous: previousData.data,
            };
        } catch (error) {
            console.error("Failed to fetch comparison data:", error);
            throw error;
        }
    },
};
