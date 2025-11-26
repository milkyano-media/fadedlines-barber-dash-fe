import { useState, useEffect, useCallback } from "react";
import { campaignsService } from "../services/campaignsService";

/**
 * Hook for managing campaigns data
 * @param {Object} options - Query parameters
 * @returns {Object} Campaigns data and operations
 */
export function useCampaigns(options = {}) {
    const [campaigns, setCampaigns] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch campaigns with current options
    const fetchCampaigns = useCallback(async (overrideOptions) => {
        try {
            setLoading(true);
            setError(null);

            // Always use the provided options
            const queryOptions = overrideOptions || {};

            const response = await campaignsService.getCampaigns(queryOptions);
            setCampaigns(response.data || []);
            setMeta(response.meta || null);

            return response;
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to fetch campaigns"));
            console.error("Error fetching campaigns:", err);
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array

    return {
        campaigns,
        meta,
        loading,
        error,
        fetchCampaigns,
    };
}
