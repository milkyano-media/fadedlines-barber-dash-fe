import React, { useState, useEffect, useDeferredValue } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Search, RefreshCw } from 'lucide-react';
import ConversionsList from './components/ConversionsList';
import { DATE_RANGES, INFLUENCE_FILTERS, SOURCE_TYPES } from './constants/conversionConstants';
import { useConversionsList } from './hooks/useConversionsList';
import { useDebounce } from '@/hooks/useDebounce';
import dayjs from 'dayjs';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import Pagination from '@/components/common/Pagination';

const ConversionListPage = () => {
  // Page state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [influenceFilter, setInfluenceFilter] = useState(INFLUENCE_FILTERS.ALL);
  const [sourceFilter, setSourceFilter] = useState(SOURCE_TYPES.WEBSITE); // 'all', 'website', or 'non-web'
  const [dateRange, setDateRange] = useState(DATE_RANGES.LAST_30_DAYS);
  
  // State for manual refresh status
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Debounce the search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Use deferred value for better performance when typing
  const deferredSearchTerm = useDeferredValue(debouncedSearchTerm);

  // Calculate date range parameters
  const getDateRangeParams = () => {
    const now = dayjs();
    let startDate = null;
    let endDate = now.format('YYYY-MM-DD');

    switch (dateRange) {
      case DATE_RANGES.LAST_7_DAYS:
        startDate = now.subtract(7, 'day').format('YYYY-MM-DD');
        break;
      case DATE_RANGES.LAST_30_DAYS:
        startDate = now.subtract(30, 'day').format('YYYY-MM-DD');
        break;
      case DATE_RANGES.LAST_90_DAYS:
        startDate = now.subtract(90, 'day').format('YYYY-MM-DD');
        break;
      case DATE_RANGES.ALL_TIME:
        // No start date for all time
        break;
      default:
        startDate = now.subtract(30, 'day').format('YYYY-MM-DD');
    }

    return { startDate, endDate };
  };

  // Get hook for conversions list with empty options object to avoid recreating functions
  const {
    conversions,
    meta,
    loading,
    error,
    fetchConversions
  } = useConversionsList({});

  // Fetch conversions when filters or pagination change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const { startDate, endDate } = getDateRangeParams();
    
    const queryParams = {
      page: currentPage,
      size: 10,
      search: deferredSearchTerm || undefined,
      influenceLevel: influenceFilter !== INFLUENCE_FILTERS.ALL ? influenceFilter : undefined,
      source: sourceFilter !== 'all' ? sourceFilter : undefined,
      startDate,
      endDate
    };
    
    console.log('Fetching conversions with params:', queryParams);
    
    fetchConversions(queryParams)
      .then(response => {
        console.log('Conversion response:', response);
        // Check if we're getting correctly filtered results
        if (response && response.data && response.data.length > 0) {
          console.log('First conversion source:', response.data[0].source);
          console.log('All sources:', response.data.map(conv => conv.source));
        }
      })
      .catch(error => console.error('Error fetching conversions:', error));
  }, [currentPage, deferredSearchTerm, influenceFilter, sourceFilter, dateRange]);

  // Handle refresh
  const handleRefresh = async () => {
    if (isRefreshing) return; // Prevent duplicate refresh calls
    
    setIsRefreshing(true);
    try {
      // Reset to page 1 on refresh
      setCurrentPage(1);
      
      const { startDate, endDate } = getDateRangeParams();
      
      // Refresh list data with current filters
      const refreshParams = {
        page: 1, // Always start at page 1 when refreshing
        size: 10,
        search: deferredSearchTerm || undefined,
        influenceLevel: influenceFilter !== INFLUENCE_FILTERS.ALL ? influenceFilter : undefined,
        source: sourceFilter !== 'all' ? sourceFilter : undefined,
        startDate,
        endDate
      };
      
      await fetchConversions(refreshParams);
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) setCurrentPage(1);
  }, [influenceFilter, sourceFilter, dateRange, deferredSearchTerm]);

  return (
    <div className="space-y-6">
      {/* Filters Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
        <div className="w-full md:w-1/3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by booking ID, barber, customer, or campaign..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        
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
      
      <div className="flex flex-wrap gap-4">
        <Select
          value={influenceFilter}
          onChange={(e) => setInfluenceFilter(e.target.value)}
          className="w-full md:w-[200px]"
        >
          <option value={INFLUENCE_FILTERS.ALL}>All Influence Levels</option>
          <option value={INFLUENCE_FILTERS.STRONG}>Strongly Influenced (76-100%)</option>
          <option value={INFLUENCE_FILTERS.SIGNIFICANT}>Significantly Influenced (51-75%)</option>
          <option value={INFLUENCE_FILTERS.PARTIAL}>Partially Influenced (26-50%)</option>
          <option value={INFLUENCE_FILTERS.ORGANIC}>Mostly Organic (0-25%)</option>
        </Select>
        
        <Select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="w-full md:w-[200px]"
        >
          <option value={SOURCE_TYPES.WEBSITE}>Website</option>
          <option value={SOURCE_TYPES.NON_WEB}>Non-web</option>
          <option value="all">All Sources</option>
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
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage 
          message={error.message || 'Failed to load conversions'} 
          onRetry={handleRefresh}
          className="mb-6"
        />
      )}

      {/* Conversions List */}
      {loading ? (
        <Card>
          <CardContent className="p-6 flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="large" />
          </CardContent>
        </Card>
      ) : (
        <ConversionsList conversions={conversions} />
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={meta.totalPages}
          onPageChange={setCurrentPage}
          meta={meta}
        />
      )}
    </div>
  );
};

export default ConversionListPage;
