// src/features/events/EventsPage.jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { RefreshCw, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import EventList from './components/EventList';
import { EVENT_TYPES, DATE_RANGES, SORT_OPTIONS } from './constants/eventConstants';
import { useEvents } from './hooks/useEvents';
import { useDebounce } from '@/hooks/useDebounce';
import dayjs from 'dayjs';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';

/**
 * Events page component - Lean version with just list, search, and delete functionality
 */
const EventsPage = () => {
  // Page state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [eventType, setEventType] = useState(EVENT_TYPES.ALL);
  const [dateRange, setDateRange] = useState(DATE_RANGES.LAST_30_DAYS);
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.CREATED_AT_DESC);
  
  // State for manual refresh status
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Debounce the search term
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Calculate date range parameters
  const getDateRangeParams = () => {
    const now = dayjs();
    let startDate = null;
    let endDate = now.format();

    switch (dateRange) {
      case DATE_RANGES.LAST_7_DAYS:
        startDate = now.subtract(7, 'day').format();
        break;
      case DATE_RANGES.LAST_30_DAYS:
        startDate = now.subtract(30, 'day').format();
        break;
      case DATE_RANGES.LAST_90_DAYS:
        startDate = now.subtract(90, 'day').format();
        break;
      case DATE_RANGES.ALL_TIME:
        // No start date for all time
        break;
      default:
        startDate = now.subtract(30, 'day').format();
    }

    return { startDate, endDate };
  };

  // Parse sort options
  const getSortParams = () => {
    const [field, direction] = sortBy.split('_');
    return {
      sortBy: field,
      sortDir: direction
    };
  };

  // Build query params
  const queryParams = {
    page: currentPage,
    size: 10,
    conversionSequenceId: debouncedSearchTerm || undefined,
    uniqueVisitorId: debouncedSearchTerm || undefined,
    eventName: eventType !== EVENT_TYPES.ALL ? eventType : undefined,
    ...getDateRangeParams(),
    ...getSortParams()
  };

  // Use the events hook
  const {
    events,
    meta,
    loading,
    error,
    fetchEvents,
    deleteEvent
  } = useEvents(queryParams);

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Reset to page 1 on refresh
      setCurrentPage(1);
      
      // Refresh events list
      const refreshParams = {
        ...queryParams,
        page: 1
      };
      await fetchEvents(refreshParams);
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [eventType, dateRange, sortBy, debouncedSearchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Events</h1>
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          disabled={loading || isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${(loading || isRefreshing) ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="w-full md:w-1/3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by sequence ID or visitor ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        
        <div className="flex flex-1 flex-col sm:flex-row gap-4">
          <Select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="w-full md:w-[200px]"
          >
            <option value={EVENT_TYPES.ALL}>All Event Types</option>
            <option value={EVENT_TYPES.PAGE_VISIT}>Page Visits</option>
            <option value={EVENT_TYPES.CREATE_BOOKING}>Bookings</option>
          </Select>
          
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full md:w-[200px]"
          >
            <option value={DATE_RANGES.LAST_7_DAYS}>Last 7 days</option>
            <option value={DATE_RANGES.LAST_30_DAYS}>Last 30 days</option>
            <option value={DATE_RANGES.LAST_90_DAYS}>Last 90 days</option>
            <option value={DATE_RANGES.ALL_TIME}>All time</option>
          </Select>
          
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-[200px]"
          >
            <option value={SORT_OPTIONS.CREATED_AT_DESC}>Newest First</option>
            <option value={SORT_OPTIONS.CREATED_AT_ASC}>Oldest First</option>
            <option value={SORT_OPTIONS.EVENT_NAME_ASC}>Event Type (A-Z)</option>
            <option value={SORT_OPTIONS.EVENT_NAME_DESC}>Event Type (Z-A)</option>
          </Select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage 
          message={error.message || 'Failed to load events'} 
          onRetry={handleRefresh}
        />
      )}

      {/* Events List */}
      {loading && !isRefreshing ? (
        <Card>
          <CardContent className="p-6 flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="large" />
          </CardContent>
        </Card>
      ) : (
        <EventList 
          events={events} 
          onDeleteEvent={deleteEvent}
        />
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, meta.totalElements)} of {meta.totalElements} events
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage <= 1 || loading}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {currentPage} of {meta.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(meta.totalPages, prev + 1))}
              disabled={currentPage >= meta.totalPages || loading}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
