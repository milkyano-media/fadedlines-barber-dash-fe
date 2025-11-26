import { useState, useCallback } from "react";
import { barberAnalyticsService } from "../services/barberAnalyticsService";

/**
 * Hook for managing barber analytics data
 * @returns {Object} Barber analytics data and operations
 */
export function useBarberAnalytics() {
    const [barbers, setBarbers] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch barber analytics with current options
    const fetchBarberAnalytics = useCallback(async (overrideOptions) => {
        try {
            setLoading(true);
            setError(null);

            // Always use the provided options
            const queryOptions = overrideOptions || {};

            const response = await barberAnalyticsService.getBarberAnalytics(queryOptions);
            setBarbers(response.data || []);
            setMeta(response.meta || null);

            return response;
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to fetch barber analytics"));
            console.error("Error fetching barber analytics:", err);
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array

    return {
        barbers,
        meta,
        loading,
        error,
        fetchBarberAnalytics,
    };
}
