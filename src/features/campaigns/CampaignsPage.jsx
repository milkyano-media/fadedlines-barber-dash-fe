import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import CampaignList from './components/CampaignList';

const CampaignsPage = () => {
  const [isLoading, setIsLoading] = useState(false);

  // Dummy data for campaigns
  const campaigns = [
    {
      id: 1,
      name: 'Spring Promo 2025',
      utmSource: 'facebook',
      visitCount: 245,
      bookingCount: 38,
      conversionRate: 15.5,
      avgInfluenceScore: 72,
      status: 'active'
    },
    {
      id: 2,
      name: 'Summer Cuts',
      utmSource: 'instagram',
      visitCount: 189,
      bookingCount: 29,
      conversionRate: 15.3,
      avgInfluenceScore: 68,
      status: 'active'
    },
    {
      id: 3,
      name: 'Back to School',
      utmSource: 'google',
      visitCount: 342,
      bookingCount: 45,
      conversionRate: 13.2,
      avgInfluenceScore: 65,
      status: 'completed'
    },
    {
      id: 4,
      name: 'Holiday Special',
      utmSource: 'email',
      visitCount: 156,
      bookingCount: 28,
      conversionRate: 17.9,
      avgInfluenceScore: 80,
      status: 'active'
    }
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Campaign Analytics</h1>
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
          <CardDescription>
            Track performance metrics for your marketing campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CampaignList campaigns={campaigns} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignsPage;
