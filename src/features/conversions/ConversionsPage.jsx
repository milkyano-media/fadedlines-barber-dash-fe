import React, { useState, useEffect, useDeferredValue } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Calendar, TrendingUp, DollarSign, Users, RefreshCw } from 'lucide-react';
import ConversionsList from './components/ConversionsList';
import ConversionsSummary from './components/ConversionsSummary';
import { DATE_RANGES, INFLUENCE_FILTERS, SOURCE_TYPES } from './constants/conversionConstants';
import { useConversions } from './hooks/useConversions';
import { useDebounce } from '@/hooks/useDebounce';
import dayjs from 'dayjs';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import Pagination from '@/components/common/Pagination';

const ConversionsPage = () => {
  // Page state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter states  
  const [searchTerm, setSearchTerm] = useState('');
  const [influenceFilter, setInfluenceFilter] = useState(INFLUENCE_FILTERS.ALL);
  const [sourceFilter, setSourceFilter] = useState('all'); // 'all', 'website', or 'non-web'
  const [dateRange, setDateRange] = useState(DATE_RANGES.LAST_30_DAYS);
  
  // Tab state
  const [activeTab, setActiveTab] = useState('summary');
  
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

  // Build query params - use deferred search term to avoid excessive re-fetches
  const queryParams = {
    page: currentPage,
    size: 10,
    search: deferredSearchTerm || undefined,
    influenceLevel: influenceFilter !== INFLUENCE_FILTERS.ALL ? influenceFilter : undefined,
    source: sourceFilter !== 'all' ? sourceFilter : undefined,
    ...getDateRangeParams()
  };

  // Use the conversions hook with simplified parameters
  const {
    conversions,
    meta,
    stats,
    loading,
    error,
    fetchConversions,
    fetchSummary
  } = useConversions(queryParams);

  // Summary data state (managed separately to avoid circular dependencies)
  const [summaryData, setSummaryData] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  // Fetch summary data when date range or source filter changes or on page load
  useEffect(() => {
    // Only fetch summary data if we're on the summary tab
    if (activeTab !== 'summary') return;
    
    const fetchSummaryData = async () => {
      try {
        setSummaryLoading(true);
        setSummaryError(null);
        const { startDate, endDate } = getDateRangeParams();
        
        // Add source filter to summary query if it's not 'all'
        const sourceParam = sourceFilter !== 'all' ? sourceFilter : undefined;
        const summary = await fetchSummary(startDate, endDate, sourceParam);
        setSummaryData(summary);
        
        // Log successful summary fetch
        console.log('Summary data fetched successfully:', summary);
      } catch (err) {
        setSummaryError(err instanceof Error ? err : new Error('Failed to fetch summary'));
        console.error('Error fetching summary:', err);
      } finally {
        setSummaryLoading(false);
      }
    };

    fetchSummaryData();
  }, [dateRange, sourceFilter, fetchSummary, activeTab]); // Re-fetch when date range, source filter changes or tab changes

  // Handle refresh - fetch data based on active tab
  const handleRefresh = async () => {
    if (isRefreshing) return; // Prevent duplicate refresh calls
    
    setIsRefreshing(true);
    try {
      // Reset to page 1 on refresh only for list tab
      if (activeTab === 'list') {
        setCurrentPage(1);
      }
      
      const { startDate, endDate } = getDateRangeParams();
      
      // Only refresh data for the active tab
      if (activeTab === 'summary') {
        // Refresh summary data
        const sourceParam = sourceFilter !== 'all' ? sourceFilter : undefined;
        const summary = await fetchSummary(startDate, endDate, sourceParam);
        setSummaryData(summary);
        console.log('Summary data refreshed successfully:', summary);
      } else if (activeTab === 'list') {
        // Refresh list data with current filters
        const refreshParams = {
          page: 1, // Always start at page 1 when refreshing
          size: 10,
          search: deferredSearchTerm || undefined,
          influenceLevel: influenceFilter !== INFLUENCE_FILTERS.ALL ? influenceFilter : undefined,
          source: sourceFilter !== 'all' ? sourceFilter : undefined,
          startDate: startDate,
          endDate: endDate
        };
        await fetchConversions(refreshParams);
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Reset to page 1 when filters change (except when search is changing)
  useEffect(() => {
    setCurrentPage(1);
  }, [influenceFilter, sourceFilter, dateRange]);

  // Load appropriate data when tab changes
  useEffect(() => {
    if (activeTab === 'summary') {
      // Fetch summary data if not already loaded
      if (!summaryData && !summaryLoading) {
        const { startDate, endDate } = getDateRangeParams();
        fetchSummary(startDate, endDate)
          .then(setSummaryData)
          .catch(err => console.error('Error loading summary data on tab change', err));
      }
    } else if (activeTab === 'list') {
      // Fetch list data if needed (conversions will be empty on first load)
      if (!loading && conversions.length === 0) {
        fetchConversions();
      }
    }
  }, [activeTab, summaryData, summaryLoading, loading, conversions.length, fetchSummary, fetchConversions]);

  // Stats to display (prefer summary data as it's more comprehensive, fallback to per-page stats)
  const displayStats = summaryData || stats || {
    totalConversions: 0,
    adInfluencedCount: 0,
    averageInfluenceScore: 0,
    totalRevenue: 0
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Conversions</h1>
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
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(tab) => {
        setActiveTab(tab);
        // Don't trigger other effects when changing tabs
      }} className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="list">Conversion List</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="mt-6">
          {activeTab === 'summary' && (
            <ConversionsSummary
              summaryData={displayStats}
              summaryLoading={summaryLoading}
              summaryError={summaryError}
              dateRange={dateRange}
              setDateRange={setDateRange}
              sourceFilter={sourceFilter}
              setSourceFilter={setSourceFilter}
              onRetry={async () => {
                try {
                  setSummaryLoading(true);
                  const { startDate, endDate } = getDateRangeParams();
                  const sourceParam = sourceFilter !== 'all' ? sourceFilter : undefined;
                  const summary = await fetchSummary(startDate, endDate, sourceParam);
                  setSummaryData(summary);
                  setSummaryError(null);
                } catch (err) {
                  console.error('Error retrying summary fetch:', err);
                } finally {
                  setSummaryLoading(false);
                }
              }}
            />
          )}
        </TabsContent>
        
        <TabsContent value="list" className="mt-6">
          {activeTab === 'list' && (
            <>
              {/* List Filters */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
                <div className="w-full md:w-1/3">
                  <Input
                    placeholder="Search by booking ID, barber, customer, or campaign..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div className="flex flex-1 flex-wrap gap-4">
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
                    <option value="all">All Sources</option>
                    <option value={SOURCE_TYPES.WEBSITE}>Website</option>
                    <option value={SOURCE_TYPES.NON_WEB}>Non-web</option>
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
              <div className="mt-6">
                {loading ? (
                <Card>
                  <CardContent className="p-6 flex items-center justify-center min-h-[400px]">
                    <LoadingSpinner size="large" />
                  </CardContent>
                </Card>
              ) : (
                <ConversionsList conversions={conversions} />
                )}
              </div>

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={meta.totalPages}
                  onPageChange={setCurrentPage}
                  meta={meta}
                />
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConversionsPage;
