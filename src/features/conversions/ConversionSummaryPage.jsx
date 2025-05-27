import React, { useState, useEffect } from 'react';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import ConversionsSummary from './components/ConversionsSummary';
import { DATE_RANGES, SOURCE_TYPES } from './constants/conversionConstants';
import { useConversionsSummary } from './hooks/useConversionsSummary';
import dayjs from 'dayjs';

const ConversionSummaryPage = () => {
  // Filter states
  const [dateRange, setDateRange] = useState(DATE_RANGES.LAST_30_DAYS);
  const [sourceFilter, setSourceFilter] = useState(SOURCE_TYPES.WEBSITE);

  // State for manual refresh status
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get summary hook
  const { summaryData, summaryLoading, summaryError, fetchSummary } =
    useConversionsSummary();

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

  // Fetch summary data when date range or source filter changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const fetchSummaryData = async () => {
      try {
        const { startDate, endDate } = getDateRangeParams();

        // Add source filter to summary query if it's not 'all'
        const sourceParam = sourceFilter !== 'all' ? sourceFilter : undefined;
        await fetchSummary(startDate, endDate, sourceParam);
      } catch (err) {
        console.error('Error fetching summary:', err);
      }
    };

    fetchSummaryData();
  }, [dateRange, sourceFilter]);

  // Handle refresh
  const handleRefresh = async () => {
    if (isRefreshing) return; // Prevent duplicate refresh calls

    setIsRefreshing(true);
    try {
      const { startDate, endDate } = getDateRangeParams();

      // Refresh summary data
      const sourceParam = sourceFilter !== 'all' ? sourceFilter : undefined;
      await fetchSummary(startDate, endDate, sourceParam);
    } catch (err) {
      console.error('Error refreshing summary data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className='space-y-6'>
      {/* Refresh button */}
      <div className='flex justify-end'>
        <Button
          variant='outline'
          onClick={handleRefresh}
          disabled={summaryLoading || isRefreshing}
          className='flex items-center gap-2'
        >
          <RefreshCw
            className={`h-4 w-4 ${
              summaryLoading || isRefreshing ? 'animate-spin' : ''
            }`}
          />
          Refresh Data
        </Button>
      </div>

      {/* Summary component */}
      <ConversionsSummary
        summaryData={summaryData}
        summaryLoading={summaryLoading}
        summaryError={summaryError}
        dateRange={dateRange}
        setDateRange={setDateRange}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        onRetry={handleRefresh}
      />
    </div>
  );
};

export default ConversionSummaryPage;
