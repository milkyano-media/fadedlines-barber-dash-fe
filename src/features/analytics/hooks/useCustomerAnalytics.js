import { useState, useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';

/**
 * Hook for managing customer analytics data
 * @param {Object} options - Query parameters
 * @returns {Object} Customer analytics data and operations
 */
export function useCustomerAnalytics(options = {}) {
  const [customers, setCustomers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch customer analytics with current options
  const fetchCustomerAnalytics = useCallback(async (overrideOptions) => {
    try {
      setLoading(true);
      setError(null);

      // Always use the provided options
      const queryOptions = overrideOptions || {};

      const response = await analyticsService.getCustomerAnalytics(queryOptions);
      setCustomers(response.data || []);
      setMeta(response.meta || null);

      return response;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error('Failed to fetch customer analytics')
      );
      console.error('Error fetching customer analytics:', err);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array

  return {
    customers,
    meta,
    loading,
    error,
    fetchCustomerAnalytics
  };
}
