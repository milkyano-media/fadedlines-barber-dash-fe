import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { X, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ComparisonDisplay from './ComparisonDisplay';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import { conversionsService } from '../services/conversionsService';
import { COMPARISON_RANGES } from '../constants/conversionConstants';
import dayjs from 'dayjs';

const ComparisonModal = ({ 
  isOpen, 
  onClose, 
  currentPeriod, 
  sourceFilter 
}) => {
  const [comparisonRange, setComparisonRange] = useState(COMPARISON_RANGES.LAST_MONTH);
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);
  const [customCurrentStartDate, setCustomCurrentStartDate] = useState(null);
  const [customCurrentEndDate, setCustomCurrentEndDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);
  
  // Memoize current period to prevent unnecessary re-renders
  const memoizedCurrentPeriod = useMemo(() => currentPeriod, [currentPeriod]);

  // Reset custom dates when switching comparison range
  useEffect(() => {
    if (comparisonRange !== COMPARISON_RANGES.CUSTOM) {
      setCustomStartDate(null);
      setCustomEndDate(null);
      setCustomCurrentStartDate(null);
      setCustomCurrentEndDate(null);
    } else {
      // Pre-populate with current period dates when switching to custom
      if (!customCurrentStartDate && !customCurrentEndDate && memoizedCurrentPeriod) {
        setCustomCurrentStartDate(dayjs(memoizedCurrentPeriod.startDate).toDate());
        setCustomCurrentEndDate(dayjs(memoizedCurrentPeriod.endDate).toDate());
      }
    }
  }, [comparisonRange, memoizedCurrentPeriod, customCurrentStartDate, customCurrentEndDate]);

  // Calculate comparison period based on selected range
  const getComparisonPeriod = () => {
    let startDate, endDate;
    
    // Get current period dates for reference
    const currentStart = dayjs(memoizedCurrentPeriod.startDate);
    const currentEnd = dayjs(memoizedCurrentPeriod.endDate);

    switch (comparisonRange) {
      case COMPARISON_RANGES.LAST_MONTH: {
        // Get the previous full calendar month based on current period's end date
        const previousMonth = currentEnd.subtract(1, 'month');
        startDate = previousMonth.startOf('month').format('YYYY-MM-DD');
        endDate = previousMonth.endOf('month').format('YYYY-MM-DD');
        break;
      }
      
      case COMPARISON_RANGES.LAST_30_DAYS:
        // 30 days immediately before current period starts
        endDate = currentStart.subtract(1, 'day').format('YYYY-MM-DD');
        startDate = currentStart.subtract(30, 'day').format('YYYY-MM-DD');
        break;
      
      case COMPARISON_RANGES.LAST_WEEK: {
        // Week-over-Week: Compare last complete Sun-Sat week with previous Sun-Sat week
        const today = dayjs();
        const dayOfWeek = today.day(); // 0 = Sunday, 6 = Saturday
        
        // Find the start of last complete week (previous Sunday)
        let lastWeekSunday;
        if (dayOfWeek === 0) {
          // If today is Sunday, last complete week started 7 days ago
          lastWeekSunday = today.subtract(7, 'day');
        } else {
          // Otherwise, go back to last Sunday
          lastWeekSunday = today.subtract(dayOfWeek, 'day');
        }
        
        // The week before last complete week (2 weeks ago)
        startDate = lastWeekSunday.subtract(7, 'day').format('YYYY-MM-DD'); // Two Sundays ago
        endDate = lastWeekSunday.subtract(1, 'day').format('YYYY-MM-DD'); // Saturday before last Sunday
        break;
      }
      
      case COMPARISON_RANGES.LAST_7_DAYS: {
        // 7-day-over-7-day: Compare last 7 days with previous 7 days
        const today = dayjs();
        endDate = today.subtract(7, 'day').format('YYYY-MM-DD');
        startDate = today.subtract(14, 'day').format('YYYY-MM-DD');
        break;
      }
      
      case COMPARISON_RANGES.LAST_14_DAYS: {
        // 14-day-over-14-day: Compare last 14 days with previous 14 days
        const today = dayjs();
        endDate = today.subtract(14, 'day').format('YYYY-MM-DD');
        startDate = today.subtract(28, 'day').format('YYYY-MM-DD');
        break;
      }
      
      case COMPARISON_RANGES.CUSTOM:
        // For custom range, use the comparison period dates
        if (customStartDate && customEndDate) {
          startDate = dayjs(customStartDate).format('YYYY-MM-DD');
          endDate = dayjs(customEndDate).format('YYYY-MM-DD');
        }
        break;
    }

    return { startDate, endDate };
  };

  // Get period label for display
  const getPeriodLabel = () => {
    switch (comparisonRange) {
      case COMPARISON_RANGES.LAST_MONTH:
        return 'Previous Month';
      case COMPARISON_RANGES.LAST_30_DAYS:
        return 'Previous 30 Days';
      case COMPARISON_RANGES.LAST_WEEK:
        return 'Last Week';
      case COMPARISON_RANGES.LAST_7_DAYS:
        return 'Previous 7 Days';
      case COMPARISON_RANGES.LAST_14_DAYS:
        return 'Previous 14 Days';
      case COMPARISON_RANGES.CUSTOM:
        if (customStartDate && customEndDate) {
          return `${dayjs(customStartDate).format('MMM D')} - ${dayjs(customEndDate).format('MMM D, YYYY')}`;
        }
        return 'Custom Range';
      default:
        return '';
    }
  };

  // Get adjusted current period for week-over-week and month comparisons
  const getAdjustedCurrentPeriod = () => {
    const today = dayjs();
    
    switch (comparisonRange) {
      case COMPARISON_RANGES.LAST_WEEK: {
        // For week-over-week, use last complete week (Sun-Sat) as current period
        const dayOfWeek = today.day();
        
        // Find the start of last complete week
        let lastWeekSunday;
        if (dayOfWeek === 0) {
          // If today is Sunday, last complete week started 7 days ago
          lastWeekSunday = today.subtract(7, 'day');
        } else {
          // Otherwise, go back to last Sunday
          lastWeekSunday = today.subtract(dayOfWeek, 'day');
        }
        
        return {
          startDate: lastWeekSunday.format('YYYY-MM-DD'), // Last week's Sunday
          endDate: lastWeekSunday.add(6, 'day').format('YYYY-MM-DD')  // Last week's Saturday
        };
      }
      
      case COMPARISON_RANGES.LAST_MONTH:
        // For month comparison, use current full month
        return {
          startDate: today.startOf('month').format('YYYY-MM-DD'),
          endDate: today.endOf('month').format('YYYY-MM-DD')
        };
      
      case COMPARISON_RANGES.LAST_7_DAYS:
        // For 7-day-over-7-day, use last 7 days as current period
        return {
          startDate: today.subtract(6, 'day').format('YYYY-MM-DD'),
          endDate: today.format('YYYY-MM-DD')
        };
      
      case COMPARISON_RANGES.LAST_14_DAYS:
        // For 14-day-over-14-day, use last 14 days as current period
        return {
          startDate: today.subtract(13, 'day').format('YYYY-MM-DD'),
          endDate: today.format('YYYY-MM-DD')
        };
      
      case COMPARISON_RANGES.CUSTOM:
        // For custom range, use custom current period dates if available
        if (customCurrentStartDate && customCurrentEndDate) {
          return {
            startDate: dayjs(customCurrentStartDate).format('YYYY-MM-DD'),
            endDate: dayjs(customCurrentEndDate).format('YYYY-MM-DD')
          };
        }
        return memoizedCurrentPeriod;
      
      default:
        return memoizedCurrentPeriod;
    }
  };

  // Fetch comparison data
  const fetchComparisonData = async () => {
    try {
      setLoading(true);
      setError(null);

      const comparisonPeriod = getComparisonPeriod();
      const adjustedCurrentPeriod = getAdjustedCurrentPeriod();
      
      if (!comparisonPeriod.startDate || !comparisonPeriod.endDate) {
        setError(new Error('Please select a valid comparison period'));
        return;
      }

      if (!adjustedCurrentPeriod.startDate || !adjustedCurrentPeriod.endDate) {
        setError(new Error('Please select a valid current period'));
        return;
      }

      // Validate date ranges don't have invalid order
      if (dayjs(adjustedCurrentPeriod.startDate).isAfter(adjustedCurrentPeriod.endDate)) {
        setError(new Error('Current period start date must be before end date'));
        return;
      }

      if (dayjs(comparisonPeriod.startDate).isAfter(comparisonPeriod.endDate)) {
        setError(new Error('Comparison period start date must be before end date'));
        return;
      }

      const data = await conversionsService.getComparisonData(
        adjustedCurrentPeriod,
        comparisonPeriod,
        sourceFilter !== 'all' ? sourceFilter : undefined
      );

      setComparisonData(data);
    } catch (err) {
      setError(err);
      console.error('Error fetching comparison data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when modal opens or comparison range changes
  useEffect(() => {
    if (isOpen) {
      if (comparisonRange !== COMPARISON_RANGES.CUSTOM) {
        fetchComparisonData();
      } else if (customStartDate && customEndDate && customCurrentStartDate && customCurrentEndDate) {
        fetchComparisonData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, comparisonRange, customStartDate, customEndDate, customCurrentStartDate, customCurrentEndDate, memoizedCurrentPeriod, sourceFilter]);

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Period Comparison</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Comparison Range Selector */}
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Compare current period to:</label>
              <Select
                value={comparisonRange}
                onChange={(e) => setComparisonRange(e.target.value)}
                className="w-full max-w-xs"
              >
                <option value={COMPARISON_RANGES.LAST_MONTH}>Previous Month</option>
                <option value={COMPARISON_RANGES.LAST_30_DAYS}>Previous 30 Days</option>
                <option value={COMPARISON_RANGES.LAST_WEEK}>Week-over-Week</option>
                <option value={COMPARISON_RANGES.LAST_7_DAYS}>7-Day-over-7-Day</option>
                <option value={COMPARISON_RANGES.LAST_14_DAYS}>14-Day-over-14-Day</option>
                <option value={COMPARISON_RANGES.CUSTOM}>Custom Range</option>
              </Select>
            </div>

            {/* Custom Date Range */}
            {comparisonRange === COMPARISON_RANGES.CUSTOM && (
              <div className="space-y-4">
                {/* Current Period */}
                <div>
                  <label className="block text-sm font-medium mb-2">Current Period</label>
                  <div className="flex items-center gap-2">
                    <DatePicker
                      selected={customCurrentStartDate}
                      onChange={setCustomCurrentStartDate}
                      placeholderText="Start date"
                      dateFormat="MMM dd, yyyy"
                      maxDate={customCurrentEndDate || new Date()}
                      className="flex h-9 w-[140px] items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      calendarClassName="react-datepicker-custom"
                    />
                    <span className="text-muted-foreground">to</span>
                    <DatePicker
                      selected={customCurrentEndDate}
                      onChange={setCustomCurrentEndDate}
                      placeholderText="End date"
                      dateFormat="MMM dd, yyyy"
                      minDate={customCurrentStartDate}
                      maxDate={new Date()}
                      className="flex h-9 w-[140px] items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      calendarClassName="react-datepicker-custom"
                    />
                  </div>
                </div>
                
                {/* Comparison Period */}
                <div>
                  <label className="block text-sm font-medium mb-2">Comparison Period</label>
                  <div className="flex items-center gap-2">
                    <DatePicker
                      selected={customStartDate}
                      onChange={setCustomStartDate}
                      placeholderText="Start date"
                      dateFormat="MMM dd, yyyy"
                      maxDate={customEndDate || new Date()}
                      className="flex h-9 w-[140px] items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      calendarClassName="react-datepicker-custom"
                    />
                    <span className="text-muted-foreground">to</span>
                    <DatePicker
                      selected={customEndDate}
                      onChange={setCustomEndDate}
                      placeholderText="End date"
                      dateFormat="MMM dd, yyyy"
                      minDate={customStartDate}
                      maxDate={new Date()}
                      className="flex h-9 w-[140px] items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                      calendarClassName="react-datepicker-custom"
                    />
                  </div>
                </div>

                {/* Date overlap warning */}
                {customCurrentStartDate && customCurrentEndDate && customStartDate && customEndDate && (() => {
                  try {
                    const currentStart = dayjs(customCurrentStartDate);
                    const currentEnd = dayjs(customCurrentEndDate);
                    const compStart = dayjs(customStartDate);
                    const compEnd = dayjs(customEndDate);
                    
                    // Check if dayjs objects are valid
                    if (!currentStart.isValid() || !currentEnd.isValid() || !compStart.isValid() || !compEnd.isValid()) {
                      return null;
                    }
                    
                    const hasOverlap = (currentStart.isSameOrBefore(compEnd, 'day') && currentEnd.isSameOrAfter(compStart, 'day'));
                    
                    return hasOverlap ? (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          ⚠️ Warning: The selected periods overlap. This may affect comparison accuracy.
                        </p>
                      </div>
                    ) : null;
                  } catch (error) {
                    console.error('Error checking date overlap:', error);
                    return null;
                  }
                })()}
              </div>
            )}
          </div>

          {/* Period Info */}
          <div className="mb-6 p-4 bg-muted/50 rounded-lg space-y-2">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">
                {comparisonRange === COMPARISON_RANGES.LAST_WEEK ? 'Last week:' : 
                 comparisonRange === COMPARISON_RANGES.LAST_MONTH ? 'Current month:' : 
                 comparisonRange === COMPARISON_RANGES.LAST_7_DAYS ? 'Last 7 days:' :
                 comparisonRange === COMPARISON_RANGES.LAST_14_DAYS ? 'Last 14 days:' :
                 'Current period:'}
              </span> {dayjs(getAdjustedCurrentPeriod().startDate).format('MMM D, YYYY')} - {dayjs(getAdjustedCurrentPeriod().endDate).format('MMM D, YYYY')}
            </p>
            {(comparisonData || (comparisonRange === COMPARISON_RANGES.CUSTOM && customStartDate && customEndDate)) && (
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">
                  {comparisonRange === COMPARISON_RANGES.LAST_WEEK ? 'Previous week:' :
                   comparisonRange === COMPARISON_RANGES.LAST_MONTH ? 'Previous month:' :
                   comparisonRange === COMPARISON_RANGES.LAST_7_DAYS ? 'Previous 7 days:' :
                   comparisonRange === COMPARISON_RANGES.LAST_14_DAYS ? 'Previous 14 days:' :
                   'Comparison period:'}
                </span> {dayjs(getComparisonPeriod().startDate).format('MMM D, YYYY')} - {dayjs(getComparisonPeriod().endDate).format('MMM D, YYYY')}
              </p>
            )}
          </div>

          {/* Comparison Results */}
          {loading && (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="large" />
            </div>
          )}

          {error && (
            <ErrorMessage 
              message={error.message || 'Failed to load comparison data'} 
              onRetry={fetchComparisonData}
            />
          )}

          {!loading && !error && comparisonData && (
            <ComparisonDisplay
              currentData={comparisonData.current}
              previousData={comparisonData.previous}
              periodLabel={getPeriodLabel()}
            />
          )}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default ComparisonModal;