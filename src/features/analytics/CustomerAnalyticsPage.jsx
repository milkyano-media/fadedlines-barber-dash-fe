import React, { useState, useEffect, useDeferredValue } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Search, RefreshCw } from 'lucide-react';
import CustomerAnalyticsList from './components/CustomerAnalyticsList';
import { useCustomerAnalytics } from './hooks/useCustomerAnalytics';
import { useDebounce } from '@/hooks/useDebounce';
import dayjs from 'dayjs';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import Pagination from '@/components/common/Pagination';

const CustomerAnalyticsPage = () => {
  // Page state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('totalConversions');
  const [sortDir, setSortDir] = useState('desc');
  const [dateRange, setDateRange] = useState('30d');
  
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
      case '7d':
        startDate = now.subtract(7, 'day').format('YYYY-MM-DD');
        break;
      case '30d':
        startDate = now.subtract(30, 'day').format('YYYY-MM-DD');
        break;
      case '90d':
        startDate = now.subtract(90, 'day').format('YYYY-MM-DD');
        break;
      case 'all':
        // No start date for all time
        break;
      default:
        startDate = now.subtract(30, 'day').format('YYYY-MM-DD');
    }

    return { startDate, endDate };
  };

  // Get hook for customer analytics
  const {
    customers,
    meta,
    loading,
    error,
    fetchCustomerAnalytics
  } = useCustomerAnalytics({});

  // Add state for summary stats
  const [summaryStats, setSummaryStats] = useState({
    totalCustomers: 0,
    totalConversions: 0,
    totalRevenue: 0,
    averageOrderValue: 0
  });

  // Fetch customer analytics when filters or pagination change
  useEffect(() => {
    const { startDate, endDate } = getDateRangeParams();
    
    const queryParams = {
      page: currentPage,
      size: 10,
      search: deferredSearchTerm || undefined,
      sortBy,
      sortDir,
      startDate,
      endDate
    };
    
    fetchCustomerAnalytics(queryParams).then(response => {
      if (response && response.summary) {
        setSummaryStats(response.summary);
      }
    });
  }, [currentPage, deferredSearchTerm, sortBy, sortDir, dateRange, fetchCustomerAnalytics]);

  // Handle refresh
  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      setCurrentPage(1);
      
      const { startDate, endDate } = getDateRangeParams();
      
      const refreshParams = {
        page: 1,
        size: 10,
        search: deferredSearchTerm || undefined,
        sortBy,
        sortDir,
        startDate,
        endDate
      };
      
      const response = await fetchCustomerAnalytics(refreshParams);
      if (response && response.summary) {
        setSummaryStats(response.summary);
      }
    } catch (err) {
      console.error('Error refreshing data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) setCurrentPage(1);
  }, [sortBy, sortDir, dateRange, deferredSearchTerm]);

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Customers</h1>
        <Button
          variant='outline'
          onClick={handleRefresh}
          disabled={loading || isRefreshing}
          className='flex items-center gap-2'
        >
          <RefreshCw className={`h-4 w-4 ${(loading || isRefreshing) ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Summary Statistics */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{summaryStats.totalCustomers}</div>
            <p className='text-xs text-muted-foreground'>
              {meta ? `Showing ${customers.length} of ${meta.totalElements} on page` : 'All unique customers'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Conversions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{summaryStats.totalConversions}</div>
            <p className='text-xs text-muted-foreground'>All conversions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>${summaryStats.totalRevenue.toFixed(2)}</div>
            <p className='text-xs text-muted-foreground'>All customers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Avg. Order Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>${summaryStats.averageOrderValue.toFixed(2)}</div>
            <p className='text-xs text-muted-foreground'>Per conversion</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
        <div className="w-full md:w-1/3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <Select
            value={`${sortBy}_${sortDir}`}
            onChange={(e) => {
              const [newSortBy, newSortDir] = e.target.value.split('_');
              setSortBy(newSortBy);
              setSortDir(newSortDir);
            }}
            className="w-full md:w-[280px]"
          >
            <option value='totalConversions_desc'>Sort by Conversions (High to Low)</option>
            <option value='totalConversions_asc'>Sort by Conversions (Low to High)</option>
            <option value='totalRevenue_desc'>Sort by Revenue (High to Low)</option>
            <option value='totalRevenue_asc'>Sort by Revenue (Low to High)</option>
            <option value='customerName_asc'>Sort by Name (A-Z)</option>
            <option value='customerName_desc'>Sort by Name (Z-A)</option>
            <option value='lastBookingDate_desc'>Sort by Last Booking (Recent)</option>
            <option value='lastBookingDate_asc'>Sort by Last Booking (Oldest)</option>
          </Select>
          
          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full md:w-[200px]"
          >
            <option value='7d'>Last 7 days</option>
            <option value='30d'>Last 30 days</option>
            <option value='90d'>Last 90 days</option>
            <option value='all'>All time</option>
          </Select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage 
          message={error.message || 'Failed to load customer analytics'} 
          onRetry={handleRefresh}
          className="mb-6"
        />
      )}

      {/* Customer Analytics List */}
      {loading ? (
        <Card>
          <CardContent className="p-6 flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="large" />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>
              Customer performance and conversion history (
              {customers.length} customers)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomerAnalyticsList customers={customers} />
          </CardContent>
        </Card>
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

export default CustomerAnalyticsPage;
