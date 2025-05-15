import { useState, useEffect, useCallback } from 'react';
import { conversionsService } from '../services/conversionsService';

/**
 * Hook for managing conversions data
 * @param {import('../types/conversionTypes').UseConversionsOptions} options
 */
export function useConversions(options = {}) {
  const [conversions, setConversions] = useState([]);
  const [meta, setMeta] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch conversions with current options
  const fetchConversions = useCallback(async (overrideOptions) => {
    try {
      setLoading(true);
      setError(null);

      // Use override options if provided, otherwise use the original options
      const queryOptions = overrideOptions || options;
      
      const response = await conversionsService.getConversions(queryOptions);
      setConversions(response.data);
      setMeta(response.meta);
      setStats(response.stats);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch conversions'));
      console.error('Error fetching conversions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data when options change, but prevent infinite loops
  useEffect(() => {
    // Skip initial load if necessary
    if (Object.keys(options).length === 0) return;
    
    // Fetch data with current options
    fetchConversions(options);
  }, [options.page, options.search, options.influenceLevel, options.source, options.startDate, options.endDate]);

  // Fetch single conversion details
  const fetchConversion = useCallback(async (conversionSequenceId) => {
    try {
      const response = await conversionsService.getConversionDetails(conversionSequenceId);
      return response.data;
    } catch (err) {
      console.error('Error fetching conversion details:', err);
      throw err;
    }
  }, []);

  // Fetch summary data
  const fetchSummary = useCallback(async (startDate, endDate) => {
    try {
      const response = await conversionsService.getConversionsSummary(startDate, endDate);
      return response.data;
    } catch (err) {
      console.error('Error fetching conversions summary:', err);
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
    fetchConversion,
    fetchSummary
  };
}
