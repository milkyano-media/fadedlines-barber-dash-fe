import { useState, useCallback } from "react";
import { conversionsService } from "../services/conversionsService";

/**
 * Hook for managing conversions list data
 * @returns {Object} Conversions list data and operations
 */
export function useConversionsList() {
    const [conversions, setConversions] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(false); // Start with false since we won't fetch automatically
    const [error, setError] = useState(null);

    // Fetch conversions with current options
    // We use an empty dependency array to avoid recreating the function on every render
    const fetchConversions = useCallback(async (overrideOptions) => {
        try {
            setLoading(true);
            setError(null);

            // Always use the provided options
            const queryOptions = overrideOptions || {};

            const response = await conversionsService.getConversions(queryOptions);
            setConversions(response.data || []);
            setMeta(response.meta || null);

            return response;
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to fetch conversions"));
            console.error("Error fetching conversions:", err);
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array

    // Fetch a single conversion's details
    const fetchConversion = useCallback(async (conversionSequenceId) => {
        try {
            const response = await conversionsService.getConversionDetails(conversionSequenceId);
            return response.data;
        } catch (err) {
            console.error("Error fetching conversion details:", err);
            throw err;
        }
    }, []);

    return {
        conversions,
        meta,
        loading,
        error,
        fetchConversions,
        fetchConversion,
    };
}
