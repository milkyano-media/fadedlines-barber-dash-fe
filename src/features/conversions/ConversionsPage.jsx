import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Calendar, TrendingUp, DollarSign, Users, RefreshCw } from 'lucide-react';
import ConversionsList from './components/ConversionsList';
import { DATE_RANGES, INFLUENCE_FILTERS } from './constants/conversionConstants';
import { useConversions } from './hooks/useConversions';
import dayjs from 'dayjs';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';

const ConversionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [influenceFilter, setInfluenceFilter] = useState(INFLUENCE_FILTERS.ALL);
  const [dateRange, setDateRange] = useState(DATE_RANGES.LAST_30_DAYS);
  const [currentPage, setCurrentPage] = useState(1);
  const [summaryData, setSummaryData] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryError, setSummaryError] = useState(null);

  // Calculate date range for API calls
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

  // Build query params object
  const queryParams = {
    page: currentPage,
    size: 10,
    search: searchTerm || undefined,
    influenceLevel: influenceFilter !== INFLUENCE_FILTERS.ALL ? influenceFilter : undefined,
    ...getDateRangeParams()
  };

  // Use the conversions hook
  const {
    conversions,
    meta,
    stats,
    loading,
    error,
    fetchConversions,
    fetchSummary
  } = useConversions(queryParams);

  // Fetch summary data
  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        setSummaryLoading(true);
        setSummaryError(null);
        const { startDate, endDate } = getDateRangeParams();
        const summary = await fetchSummary(startDate, endDate);
        setSummaryData(summary);
      } catch (err) {
        setSummaryError(err instanceof Error ? err : new Error('Failed to fetch summary'));
        console.error('Error fetching summary:', err);
      } finally {
        setSummaryLoading(false);
      }
    };

    fetchSummaryData();
  }, [dateRange, fetchSummary]);

  // Handle refresh
  const handleRefresh = () => {
    fetchConversions(queryParams);
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, influenceFilter, dateRange]);

  // Stats to display (prefer stats from conversions hook, fallback to summary data)
  const displayStats = stats || summaryData || {
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
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <LoadingSpinner size="small" />
            ) : (
              <div className="text-2xl font-bold flex items-center gap-2">
                {displayStats.totalConversions}
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ad Influenced</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <LoadingSpinner size="small" />
            ) : (
              <>
                <div className="text-2xl font-bold flex items-center gap-2">
                  {displayStats.adInfluencedCount}
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
                {displayStats.totalConversions > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((displayStats.adInfluencedCount / displayStats.totalConversions) * 100)}% of total
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Influence Score</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <LoadingSpinner size="small" />
            ) : (
              <div className="text-2xl font-bold flex items-center gap-2">
                {displayStats.averageInfluenceScore}%
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <LoadingSpinner size="small" />
            ) : (
              <div className="text-2xl font-bold flex items-center gap-2">
                ${displayStats.totalRevenue.toLocaleString()}
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Search by booking ID, barber, customer, or campaign..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex flex-1 gap-4">
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
        />
      )}

      {/* Summary Error */}
      {summaryError && (
        <ErrorMessage 
          message={summaryError.message || 'Failed to load summary data'} 
          onRetry={() => {
            const { startDate, endDate } = getDateRangeParams();
            fetchSummary(startDate, endDate);
          }}
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
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, meta.totalElements)} of {meta.totalElements} conversions
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage <= 1 || loading}
            >
              Previous
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
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConversionsPage;
