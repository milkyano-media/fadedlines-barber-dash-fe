import { useState, useCallback } from "react";
import { conversionsService } from "../services/conversionsService";

/**
 * Hook for managing conversions summary data
 * @returns {Object} Conversions summary data and operations
 */
export function useConversionsSummary() {
    const [summaryData, setSummaryData] = useState({
        totalConversions: 0,
        adInfluencedCount: 0,
        averageInfluenceScore: 0,
        totalRevenue: 0,
        campaignBreakdown: [],
        influenceLevelBreakdown: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch summary data
    const fetchSummary = useCallback(async (startDate, endDate, sourceFilter) => {
        try {
            setLoading(true);
            setError(null);

            const response = await conversionsService.getConversionsSummary(startDate, endDate, sourceFilter);
            setSummaryData(response.data);

            return response.data;
        } catch (err) {
            const errorObj = err instanceof Error ? err : new Error("Failed to fetch summary");
            setError(errorObj);
            console.error("Error fetching summary:", err);
            throw errorObj;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        summaryData,
        summaryLoading: loading,
        summaryError: error,
        fetchSummary,
    };
}
