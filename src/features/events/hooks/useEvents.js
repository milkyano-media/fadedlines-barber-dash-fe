// src/features/events/hooks/useEvents.js
import { useState, useEffect, useCallback } from 'react';
import eventsService from '../services/eventsService';

/**
 * Hook for managing events data
 * @param {Object} options - Query options
 * @returns {Object} Events data and operations
 */
export function useEvents(options = {}) {
  const [events, setEvents] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch events with current options
  const fetchEvents = useCallback(
    async (overrideOptions) => {
      try {
        setLoading(true);
        setError(null);

        const queryOptions = overrideOptions || options;
        const response = await eventsService.getEvents(queryOptions);

        setEvents(response.data || []);
        setMeta(response.meta || null);

        return response;
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error('Failed to fetch events')
        );
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  // Delete an event
  const deleteEvent = useCallback(
    async (eventId) => {
      try {
        await eventsService.deleteEvent(eventId);
        // Refresh events list after deletion
        fetchEvents();
        return true;
      } catch (err) {
        console.error(`Error deleting event ${eventId}:`, err);
        return false;
      }
    },
    [fetchEvents]
  );

  // Fetch data on initial load and when options change
  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    options.page,
    options.eventName,
    options.conversionSequenceId,
    options.uniqueVisitorId,
    options.startDate,
    options.endDate
  ]);

  return {
    events,
    meta,
    loading,
    error,
    fetchEvents,
    deleteEvent
  };
}

export default useEvents;
