import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RefreshCw, Search, Filter } from 'lucide-react';
import CampaignList from './components/CampaignList';

const CampaignsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('conversionRate');

  // Dummy data for campaigns
  const allCampaigns = [
    {
      id: 1,
      name: 'Spring Promo 2025',
      utmSource: 'facebook',
      visitCount: 245,
      bookingCount: 38,
      conversionRate: 15.5,
      avgInfluenceScore: 72,
      status: 'active',
      startDate: '2025-01-15',
      revenue: 1900
    },
    {
      id: 2,
      name: 'Summer Cuts',
      utmSource: 'instagram',
      visitCount: 189,
      bookingCount: 29,
      conversionRate: 15.3,
      avgInfluenceScore: 68,
      status: 'active',
      startDate: '2025-02-01',
      revenue: 1450
    },
    {
      id: 3,
      name: 'Back to School',
      utmSource: 'google',
      visitCount: 342,
      bookingCount: 45,
      conversionRate: 13.2,
      avgInfluenceScore: 65,
      status: 'completed',
      startDate: '2024-08-15',
      revenue: 2250
    },
    {
      id: 4,
      name: 'Holiday Special',
      utmSource: 'email',
      visitCount: 156,
      bookingCount: 28,
      conversionRate: 17.9,
      avgInfluenceScore: 80,
      status: 'active',
      startDate: '2024-11-20',
      revenue: 1400
    },
    {
      id: 5,
      name: 'Weekend Special',
      utmSource: 'tiktok',
      visitCount: 98,
      bookingCount: 12,
      conversionRate: 12.2,
      avgInfluenceScore: 55,
      status: 'paused',
      startDate: '2025-03-01',
      revenue: 600
    },
    {
      id: 6,
      name: 'New Client Offer',
      utmSource: 'google',
      visitCount: 425,
      bookingCount: 65,
      conversionRate: 15.3,
      avgInfluenceScore: 70,
      status: 'active',
      startDate: '2025-04-01',
      revenue: 3250
    }
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Filter and sort campaigns
  const filteredCampaigns = allCampaigns
    .filter((campaign) => {
      const matchesSearch =
        searchTerm === '' ||
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.utmSource.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || campaign.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'conversionRate')
        return b.conversionRate - a.conversionRate;
      if (sortBy === 'visitCount') return b.visitCount - a.visitCount;
      if (sortBy === 'revenue') return b.revenue - a.revenue;
      if (sortBy === 'influenceScore')
        return b.avgInfluenceScore - a.avgInfluenceScore;
      if (sortBy === 'date')
        return new Date(b.startDate) - new Date(a.startDate);
      return 0;
    });

  // Calculate summary statistics
  const totalVisits = filteredCampaigns.reduce(
    (sum, campaign) => sum + campaign.visitCount,
    0
  );
  const totalBookings = filteredCampaigns.reduce(
    (sum, campaign) => sum + campaign.bookingCount,
    0
  );
  const averageConversion =
    totalVisits > 0 ? ((totalBookings / totalVisits) * 100).toFixed(1) : 0;
  const totalRevenue = filteredCampaigns.reduce(
    (sum, campaign) => sum + campaign.revenue,
    0
  );

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Campaign Analytics (Dummy)</h1>
        <Button
          variant='outline'
          onClick={handleRefresh}
          disabled={isLoading}
          className='flex items-center gap-2'
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Summary Statistics */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Total Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalVisits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalBookings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>
              Average Conversion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{averageConversion}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>${totalRevenue}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section */}
      <div className='flex flex-col md:flex-row gap-4'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Search campaigns by name or source...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10'
          />
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className='w-full md:w-[200px]'
        >
          <option value='all'>All Status</option>
          <option value='active'>Active</option>
          <option value='completed'>Completed</option>
          <option value='paused'>Paused</option>
        </Select>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className='w-full md:w-[200px]'
        >
          <option value='conversionRate'>Sort by Conversion Rate</option>
          <option value='visitCount'>Sort by Visits</option>
          <option value='revenue'>Sort by Revenue</option>
          <option value='influenceScore'>Sort by Influence Score</option>
          <option value='date'>Sort by Start Date</option>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Marketing Campaigns</CardTitle>
          <CardDescription>
            Track performance metrics for your marketing campaigns (
            {filteredCampaigns.length} campaigns)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CampaignList campaigns={filteredCampaigns} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignsPage;
