import { useState, useCallback } from "react";
import { analyticsService } from "../services/analyticsService";

/**
 * Hook for managing customer analytics summary data
 * @returns {Object} Customer analytics summary data and operations
 */
export function useCustomerAnalyticsSummary() {
    const [summary, setSummary] = useState({
        totalCustomers: 0,
        totalConversions: 0,
        totalRevenue: 0,
        averageOrderValue: 0,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch customer analytics summary with current options
    const fetchCustomerAnalyticsSummary = useCallback(async (overrideOptions) => {
        try {
            setLoading(true);
            setError(null);

            // Always use the provided options
            const queryOptions = overrideOptions || {};

            const response = await analyticsService.getCustomerAnalyticsSummary(queryOptions);
            if (response.data) {
                setSummary(response.data);
            }

            return response;
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to fetch customer analytics summary"));
            console.error("Error fetching customer analytics summary:", err);
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array

    return {
        summary,
        loading,
        error,
        fetchCustomerAnalyticsSummary,
    };
}
