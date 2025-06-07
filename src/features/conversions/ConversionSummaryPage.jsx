import React, { useState, useEffect, useCallback } from 'react';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCw, X } from 'lucide-react';
import ConversionsSummary from './components/ConversionsSummary';
import { DATE_RANGES, SOURCE_TYPES } from './constants/conversionConstants';
import { useConversionsSummary } from './hooks/useConversionsSummary';
import dayjs from 'dayjs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './styles/datepicker.css';

const ConversionSummaryPage = () => {
  // Filter states
  const [dateRange, setDateRange] = useState(DATE_RANGES.LAST_30_DAYS);
  const [sourceFilter, setSourceFilter] = useState(SOURCE_TYPES.WEBSITE);
  
  // Initialize custom date range based on default selection (Last 30 days)
  const now = dayjs();
  const [customStartDate, setCustomStartDate] = useState(now.subtract(30, 'day').toDate());
  const [customEndDate, setCustomEndDate] = useState(now.toDate());
  const [isCustomDateRange, setIsCustomDateRange] = useState(false);

  // State for manual refresh status
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get summary hook
  const { summaryData, summaryLoading, summaryError, fetchSummary } =
    useConversionsSummary();

  // Calculate date range parameters
  const getDateRangeParams = useCallback(() => {
    const now = dayjs();
    let startDate = null;
    let endDate = now.format('YYYY-MM-DD');

    // If custom date range is active, use those dates
    if (isCustomDateRange && customStartDate && customEndDate) {
      startDate = dayjs(customStartDate).format('YYYY-MM-DD');
      endDate = dayjs(customEndDate).format('YYYY-MM-DD');
    } else {
      // Use predefined date ranges
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
    }

    return { startDate, endDate };
  }, [dateRange, isCustomDateRange, customStartDate, customEndDate]);

  // Fetch summary data when date range or source filter changes
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
  }, [dateRange, sourceFilter, isCustomDateRange, customStartDate, customEndDate, fetchSummary, getDateRangeParams]);

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

  // Handle date range selection change
  const handleDateRangeChange = (value) => {
    setDateRange(value);
    setIsCustomDateRange(false);
    
    // Sync custom date range with selected quick range
    const now = dayjs();
    let startDate = null;
    let endDate = now.toDate();
    
    switch (value) {
      case DATE_RANGES.LAST_7_DAYS:
        startDate = now.subtract(7, 'day').toDate();
        break;
      case DATE_RANGES.LAST_30_DAYS:
        startDate = now.subtract(30, 'day').toDate();
        break;
      case DATE_RANGES.LAST_90_DAYS:
        startDate = now.subtract(90, 'day').toDate();
        break;
      case DATE_RANGES.ALL_TIME:
        startDate = null;
        endDate = null;
        break;
    }
    
    setCustomStartDate(startDate);
    setCustomEndDate(endDate);
  };

  // Calculate days difference for custom range display
  const getCustomRangeDays = () => {
    if (customStartDate && customEndDate) {
      const start = dayjs(customStartDate);
      const end = dayjs(customEndDate);
      return end.diff(start, 'day') + 1; // +1 to include both start and end dates
    }
    return null;
  };

  // Check if custom date range represents the last X days from today
  const isLastXDaysFromToday = () => {
    if (!customStartDate || !customEndDate) return false;
    
    const today = dayjs().startOf('day');
    const endDate = dayjs(customEndDate).startOf('day');
    const startDate = dayjs(customStartDate).startOf('day');
    
    // Check if end date is today
    if (!endDate.isSame(today)) return false;
    
    // Check if the start date is exactly X days before today
    const daysDiff = getCustomRangeDays() - 1; // -1 because we want days before today
    const expectedStartDate = today.subtract(daysDiff, 'day');
    
    return startDate.isSame(expectedStartDate);
  };

  // Handle custom start date change
  const handleCustomStartDateChange = (date) => {
    setCustomStartDate(date);
    if (date && customEndDate) {
      setIsCustomDateRange(true);
      // Clear the predefined date range selection
      setDateRange('');
    }
  };

  // Handle custom end date change
  const handleCustomEndDateChange = (date) => {
    setCustomEndDate(date);
    if (customStartDate && date) {
      setIsCustomDateRange(true);
      // Clear the predefined date range selection
      setDateRange('');
    }
  };

  // Clear custom date range
  const clearCustomDateRange = () => {
    // Reset to Last 30 days (default)
    const now = dayjs();
    setDateRange(DATE_RANGES.LAST_30_DAYS);
    setCustomStartDate(now.subtract(30, 'day').toDate());
    setCustomEndDate(now.toDate());
    setIsCustomDateRange(false);
  };

  return (
    <div className='space-y-6'>
      {/* Date Filters and Refresh button */}
      <div className='flex flex-col sm:flex-row justify-between gap-4'>
        {/* Date Filters */}
        <div className='flex flex-col sm:flex-row gap-4'>
          {/* Last X Days Filter */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium'>Quick Date Range</label>
            <Select
              value={isCustomDateRange ? '' : dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              className='w-full sm:w-[200px]'
            >
              {isCustomDateRange && getCustomRangeDays() && (
                <option value="" disabled>
                  {isLastXDaysFromToday() 
                    ? `Last ${getCustomRangeDays()} days` 
                    : `${getCustomRangeDays()} days range`}
                </option>
              )}
              <option value={DATE_RANGES.LAST_7_DAYS}>Last 7 days</option>
              <option value={DATE_RANGES.LAST_30_DAYS}>Last 30 days</option>
              <option value={DATE_RANGES.LAST_90_DAYS}>Last 90 days</option>
              <option value={DATE_RANGES.ALL_TIME}>All time</option>
            </Select>
          </div>

          {/* Custom Date Range Filter */}
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium'>Custom Date Range</label>
            <div className='flex items-center gap-2'>
              <DatePicker
                selected={customStartDate}
                onChange={handleCustomStartDateChange}
                placeholderText='Start date'
                dateFormat='MMM dd, yyyy'
                maxDate={customEndDate || new Date()}
                className='flex h-9 w-full sm:w-[140px] items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                calendarClassName='react-datepicker-custom'
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode='select'
              />
              <span className='text-muted-foreground'>to</span>
              <DatePicker
                selected={customEndDate}
                onChange={handleCustomEndDateChange}
                placeholderText='End date'
                dateFormat='MMM dd, yyyy'
                minDate={customStartDate}
                maxDate={new Date()}
                className='flex h-9 w-full sm:w-[140px] items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
                calendarClassName='react-datepicker-custom'
                peekNextMonth
                showMonthDropdown
                showYearDropdown
                dropdownMode='select'
              />
              {(customStartDate || customEndDate) && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={clearCustomDateRange}
                  className='p-2'
                  title='Clear custom date range'
                >
                  <X className='h-4 w-4' />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Refresh button */}
        <Button
          variant='outline'
          onClick={handleRefresh}
          disabled={summaryLoading || isRefreshing}
          className='flex items-center gap-2 self-start sm:self-auto'
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
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        onRetry={handleRefresh}
      />
    </div>
  );
};

export default ConversionSummaryPage;
