import React from 'react';
import { Link } from 'react-router';
import { useAuth } from '../auth/hooks/useAuth';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Activity,
  DollarSign,
  TrendingUp,
  Users,
  BarChart3,
  LineChart
} from 'lucide-react';

const DashboardHomePage = () => {
  const { user } = useAuth();

  // Dummy data for statistics
  const stats = {
    totalVisits: 1245,
    totalRevenue: 24567,
    conversionRate: 15.8,
    totalCustomers: 342
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Analytics Dashboard (Dummy)</h1>
        <span className='text-muted-foreground'>
          Welcome back, {user?.name}
        </span>
      </div>

      {/* Statistics Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Visits</CardTitle>
            <Activity className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {stats.totalVisits.toLocaleString()}
            </div>
            <p className='text-xs text-muted-foreground'>Website visitors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <p className='text-xs text-muted-foreground'>Total earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Conversion Rate
            </CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.conversionRate}%</div>
            <p className='text-xs text-muted-foreground'>Visitor to customer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Customers
            </CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalCustomers}</div>
            <p className='text-xs text-muted-foreground'>Active customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Event Tracking</CardTitle>
            <CardDescription>Browse all tracked events</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to='/events'
              className='inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
            >
              View Events
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Chart Placeholders */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Traffic Distribution</CardTitle>
            <CardDescription>Source of website traffic</CardDescription>
          </CardHeader>
          <CardContent className='h-[300px] flex items-center justify-center'>
            <div className='text-center'>
              <BarChart3 className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <p className='text-muted-foreground'>Traffic chart coming soon</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversion Trends</CardTitle>
            <CardDescription>Showing daily conversion data</CardDescription>
          </CardHeader>
          <CardContent className='h-[300px] flex items-center justify-center'>
            <div className='text-center'>
              <LineChart className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <p className='text-muted-foreground'>
                Conversion chart coming soon
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Top Customers (Dummy)</CardTitle>
            <CardDescription>View your best customers</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to='/customers'
              className='inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
            >
              View Customers
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Analytics (Dummy)</CardTitle>
            <CardDescription>Track campaign performance</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to='/campaigns'
              className='inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
            >
              View Campaigns
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conversions</CardTitle>
            <CardDescription>Analyze conversion data</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to='/conversions'
              className='inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2'
            >
              View Conversions
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHomePage;
