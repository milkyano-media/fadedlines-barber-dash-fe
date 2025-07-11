import React, { useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../auth/hooks/useAuth';
import { useDashboard } from './useDashboard';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import {
  Activity,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Star
} from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const DashboardHomePage = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('30d');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Calculate date range parameters
  const getDateRangeParams = (overrides = {}) => {
    const now = dayjs();
    let startDate = null;
    let endDate = now.format('YYYY-MM-DD');
    const currentDateRange = overrides.dateRange || dateRange;
    const currentSourceFilter = overrides.sourceFilter !== undefined ? overrides.sourceFilter : sourceFilter;

    switch (currentDateRange) {
      case '7d':
        startDate = now.subtract(7, 'day').format('YYYY-MM-DD');
        break;
      case '30d':
        startDate = now.subtract(30, 'day').format('YYYY-MM-DD');
        break;
      case '90d':
        startDate = now.subtract(90, 'day').format('YYYY-MM-DD');
        break;
      default:
        startDate = now.subtract(30, 'day').format('YYYY-MM-DD');
    }

    return { startDate, endDate, source: currentSourceFilter !== 'all' ? currentSourceFilter : undefined };
  };

  const { summary, recentActivity, topPerformers, loading, error, fetchDashboardData } = 
    useDashboard(getDateRangeParams());

  // Handle refresh
  const handleRefresh = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await fetchDashboardData(getDateRangeParams());
    } catch (err) {
      console.error('Error refreshing dashboard:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Handle date range change
  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
    const newParams = getDateRangeParams({ dateRange: newRange });
    fetchDashboardData(newParams);
  };

  // Handle source filter change
  const handleSourceFilterChange = (newSource) => {
    setSourceFilter(newSource);
    const newParams = getDateRangeParams({ sourceFilter: newSource });
    fetchDashboardData(newParams);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  if (error && !summary.totalConversions) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        </div>
        <ErrorMessage 
          message={error.message || 'Failed to load dashboard data'} 
          onRetry={handleRefresh}
        />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold'>Analytics Dashboard</h1>
          <span className='text-muted-foreground'>
            Welcome back, {user?.name}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <Select
            value={dateRange}
            onChange={(e) => handleDateRangeChange(e.target.value)}
            className="w-[140px] sm:w-[180px]"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </Select>
          <Select
            value={sourceFilter}
            onChange={(e) => handleSourceFilterChange(e.target.value)}
            className="w-[120px] sm:w-[140px]"
          >
            <option value="all">All Sources</option>
            <option value="website">Website</option>
            <option value="non-web">Non-Web</option>
          </Select>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${(loading || isRefreshing) ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Conversions</CardTitle>
            <Activity className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSpinner size="small" />
            ) : (
              <>
                <div className='text-2xl font-bold'>
                  {summary.totalConversions?.toLocaleString() || 0}
                </div>
                <p className='text-xs text-muted-foreground'>
                  Bookings converted from marketing
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSpinner size="small" />
            ) : (
              <>
                <div className='text-2xl font-bold'>
                  {formatCurrency(summary.totalRevenue || 0)}
                </div>
                {summary.revenueGrowth !== undefined && (
                  <div className={`flex items-center text-xs ${
                    summary.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {summary.revenueGrowth >= 0 ? 
                      <ArrowUpRight className="h-3 w-3 mr-1" /> : 
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    }
                    {formatPercentage(summary.revenueGrowth)} from previous period
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Conversion Rate</CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSpinner size="small" />
            ) : (
              <>
                <div className='text-2xl font-bold'>
                  {summary.conversionRate === null ? 'N/A' : `${summary.conversionRate?.toFixed(1) || 0}%`}
                </div>
                <p className='text-xs text-muted-foreground'>
                  {summary.conversionRate === null ? 'Direct bookings only' : 'Visitor to customer rate'}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Customers</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {loading ? (
              <LoadingSpinner size="small" />
            ) : (
              <>
                <div className='text-2xl font-bold'>
                  {summary.totalCustomers?.toLocaleString() || 0}
                </div>
                <p className='text-xs text-muted-foreground'>
                  Unique customers served
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest bookings and conversions</CardDescription>
              </div>
              <Link to="/conversions">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-6">
                <LoadingSpinner size="medium" />
              </div>
            ) : recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.slice(0, 8).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 rounded-md border">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {activity.customerName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.serviceName} • {activity.teamMemberName}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatCurrency(activity.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.timeAgo}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No recent activity found
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle>Top Performers</CardTitle>
            <CardDescription>Best customers and barbers this period</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <div className="flex justify-center p-6">
                <LoadingSpinner size="medium" />
              </div>
            ) : (
              <>
                {/* Top Customers */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium">Top Customers</h4>
                    <Link to="/customers-new">
                      <Button variant="ghost" size="sm" className="text-xs">
                        View All
                      </Button>
                    </Link>
                  </div>
                  {topPerformers.topCustomers.length > 0 ? (
                    <div className="space-y-2">
                      {topPerformers.topCustomers.map((customer, index) => (
                        <div key={customer.name} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                          <div className="flex items-center space-x-2">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                              <span className="text-xs font-medium">#{index + 1}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium">{customer.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {customer.totalConversions} booking{customer.totalConversions > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{formatCurrency(customer.totalRevenue)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No customer data available</p>
                  )}
                </div>

                {/* Top Barbers */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium">Top Barbers</h4>
                    <Link to="/barbers">
                      <Button variant="ghost" size="sm" className="text-xs">
                        View All
                      </Button>
                    </Link>
                  </div>
                  {topPerformers.topBarbers.length > 0 ? (
                    <div className="space-y-2">
                      {topPerformers.topBarbers.map((barber) => (
                        <div key={barber.name} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                          <div className="flex items-center space-x-2">
                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                              <Star className="h-3 w-3 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{barber.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {barber.totalConversions} conversion{barber.totalConversions > 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{formatCurrency(barber.totalRevenue)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No barber data available</p>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Customer Analytics</CardTitle>
            <CardDescription>View detailed customer performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to='/customers-new'>
              <Button className="w-full">
                View Customer Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Barber Analytics</CardTitle>
            <CardDescription>Track barber performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to='/barbers'>
              <Button className="w-full">
                View Barber Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Campaign Analytics</CardTitle>
            <CardDescription>Monitor marketing campaign results</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to='/campaigns'>
              <Button className="w-full">
                View Campaign Analytics
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sync & ETL</CardTitle>
            <CardDescription>Manage data synchronization</CardDescription>
          </CardHeader>
          <CardContent>
            <Link to='/sync-etl'>
              <Button className="w-full" variant="outline">
                Manage Data Sync
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHomePage;
