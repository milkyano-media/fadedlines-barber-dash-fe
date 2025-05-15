import { useState, useEffect, useCallback } from 'react';
import { conversionsService } from '../services/conversionsService';

/**
 * Hook for managing conversions list data
 * @param {Object} options - Query parameters
 * @returns {Object} Conversions list data and operations
 */
export function useConversionsList(options = {}) {
  const [conversions, setConversions] = useState([]);
  const [meta, setMeta] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false); // Start with false since we won't fetch automatically
  const [error, setError] = useState(null);

  // Fetch conversions with current options
  const fetchConversions = useCallback(async (overrideOptions) => {
    try {
      setLoading(true);
      setError(null);

      // Use override options if provided, otherwise use the original options
      const queryOptions = overrideOptions || options;
      
      const response = await conversionsService.getConversions(queryOptions);
      setConversions(response.data || []);
      setMeta(response.meta || null);
      setStats(response.stats || null);
      
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch conversions'));
      console.error('Error fetching conversions:', err);
    } finally {
      setLoading(false);
    }
  }, [options]);

  // Fetch a single conversion's details
  const fetchConversion = useCallback(async (conversionSequenceId) => {
    try {
      const response = await conversionsService.getConversionDetails(conversionSequenceId);
      return response.data;
    } catch (err) {
      console.error('Error fetching conversion details:', err);
      throw err;
    }
  }, []);

  return {
    conversions,
    meta,
    stats,
    loading,
    error,
    fetchConversions,
    fetchConversion
  };
}
