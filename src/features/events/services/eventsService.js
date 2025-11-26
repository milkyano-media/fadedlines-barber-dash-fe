// src/features/events/services/eventsService.js
import v2Client from "@/api/clients/apiClient";

/**
 * Service for fetching and managing events
 */
export const eventsService = {
    /**
     * Get events with filtering and pagination
     * @param {Object} params - Query parameters
     * @param {number} [params.page] - Page number
     * @param {number} [params.size] - Page size
     * @param {string} [params.eventName] - Filter by event name
     * @param {string} [params.conversionSequenceId] - Filter by conversion sequence ID
     * @param {string} [params.uniqueVisitorId] - Filter by unique visitor ID
     * @param {string} [params.sortBy] - Sort field
     * @param {string} [params.sortDir] - Sort direction (asc or desc)
     * @param {string} [params.startDate] - Start date filter
     * @param {string} [params.endDate] - End date filter
     * @param {boolean} [params.registrationEvents] - Filter to show only registration events
     * @returns {Promise<Object>} Response with events and metadata
     */
    async getEvents(params = {}) {
        try {
            // Build query parameters
            const queryParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString());
                }
            });

            const response = await v2Client.axiosInstance.get(`/events?${queryParams.toString()}`);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch events:", error);
            throw error;
        }
    },

    /**
     * Delete an event by ID
     * @param {number} id - Event ID
     * @returns {Promise<Object>} Response with deletion status
     */
    async deleteEvent(id) {
        try {
            const response = await v2Client.axiosInstance.delete(`/events/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Failed to delete event ${id}:`, error);
            throw error;
        }
    },
};

export default eventsService;
