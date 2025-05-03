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

  const fetchConversions = useCallback(async (opts = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Merge default options with provided options
      const fetchOptions = {
        page: options.page || 1,
        size: options.size || 10,
        ...opts
      };

      const response = await conversionsService.getConversions(fetchOptions);
      setConversions(response.data);
      setMeta(response.meta);
      setStats(response.stats);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch conversions'));
      console.error('Error fetching conversions:', err);
    } finally {
      setLoading(false);
    }
  }, [options]);

  useEffect(() => {
    fetchConversions();
  }, [fetchConversions]);

  const fetchConversion = async (conversionSequenceId) => {
    try {
      setLoading(true);
      setError(null);

      const response = await conversionsService.getConversionDetails(conversionSequenceId);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch conversion details'));
      console.error('Error fetching conversion details:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async (startDate, endDate) => {
    try {
      setLoading(true);
      setError(null);

      const response = await conversionsService.getConversionsSummary(startDate, endDate);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch conversions summary'));
      console.error('Error fetching conversions summary:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

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
