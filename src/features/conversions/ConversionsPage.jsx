import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Calendar, TrendingUp, DollarSign, Users, RefreshCw } from 'lucide-react';
import ConversionsList from './components/ConversionsList';
import { DATE_RANGES, INFLUENCE_FILTERS } from './constants/conversionConstants';

const ConversionsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [influenceFilter, setInfluenceFilter] = useState(INFLUENCE_FILTERS.ALL);
  const [dateRange, setDateRange] = useState(DATE_RANGES.LAST_30_DAYS);
  const [isLoading, setIsLoading] = useState(false);

  // Dummy data - will be replaced with API data
  const summaryData = {
    totalConversions: 30,
    adInfluencedCount: 24,
    averageInfluenceScore: 65,
    totalRevenue: 2850,
  };

  const conversionsData = [
    {
      id: 1,
      conversionSequenceId: "5f0c935e-ea9e-4271-b02e-f3f27048bd65",
      adsInfluenceScore: 50,
      influenceCategory: "Partially influenced by ads",
      campaignName: "spring_promo",
      bookingId: "booking-123",
      customerName: "John Smith",
      serviceName: "Premium Cut & Style",
      amount: 75,
      teamMemberId: "TM123456",
      createdAt: "2025-04-30T16:55:00.000Z",
      details: {
        events: [
          {
            eventName: "page_visit",
            date: "2025-04-27 14:05",
            pageUrl: "/?fbclid=IwAR987cba654zyx",
            trafficSource: "FACEBOOK",
            utm: null,
            fbclid: "IwAR987cba654zyx",
            score: 1,
            sessionId: "session-123"
          },
          {
            eventName: "page_visit",
            date: "2025-04-29 19:20",
            pageUrl: "/",
            trafficSource: "DIRECT",
            utm: null,
            fbclid: null,
            score: 0,
            sessionId: "session-456"
          },
          {
            eventName: "page_visit",
            date: "2025-04-30 16:45",
            pageUrl: "/?fbclid=IwAR543qwe876rty&utm_source=facebook&utm_medium=social&utm_campaign=spring_promo",
            trafficSource: "FACEBOOK",
            utm: "facebook/social/spring_promo/retargeting_ad_1",
            fbclid: "IwAR543qwe876rty",
            score: 2,
            sessionId: "session-789"
          },
          {
            eventName: "create_booking",
            date: "2025-04-30 16:55",
            pageUrl: "/book/contact-info",
            trafficSource: "FACEBOOK",
            utm: "facebook/social/spring_promo/retargeting_ad_1",
            fbclid: "IwAR543qwe876rty",
            score: 0,
            sessionId: "session-789"
          }
        ],
        score: {
          totalPoints: 3,
          totalVisits: 3,
          maxPossiblePoints: 6,
          scoreCalculation: "3 / (3 × 2) × 100% = 50%"
        }
      }
    },
    {
      id: 2,
      conversionSequenceId: "3a4b5c6d-7e8f-9a0b-1c2d-3e4f5a6b7c8d",
      adsInfluenceScore: 100,
      influenceCategory: "Strongly influenced by ads",
      campaignName: "summer_cuts",
      bookingId: "booking-456",
      customerName: "Emma Johnson",
      serviceName: "Premium Style & Cut",
      amount: 55,
      teamMemberId: "TM789012",
      createdAt: "2025-04-30T13:48:00.000Z",
      details: {
        events: [
          {
            eventName: "page_visit",
            date: "2025-04-29 09:05",
            pageUrl: "/?fbclid=IwAR789xyz123abc&utm_source=facebook&utm_medium=social&utm_campaign=summer_cuts",
            trafficSource: "FACEBOOK",
            utm: "facebook/social/summer_cuts/carousel_ad_1",
            fbclid: "IwAR789xyz123abc",
            score: 2,
            sessionId: "session-abc"
          },
          {
            eventName: "page_visit",
            date: "2025-04-30 13:40",
            pageUrl: "/book/services",
            trafficSource: "FACEBOOK",
            utm: "facebook/social/summer_cuts/carousel_ad_1",
            fbclid: "IwAR789xyz123abc",
            score: 2,
            sessionId: "session-def"
          },
          {
            eventName: "create_booking",
            date: "2025-04-30 13:48",
            pageUrl: "/book/contact-info",
            trafficSource: "FACEBOOK",
            utm: "facebook/social/summer_cuts/carousel_ad_1",
            fbclid: "IwAR789xyz123abc",
            score: 0,
            sessionId: "session-def"
          }
        ],
        score: {
          totalPoints: 4,
          totalVisits: 2,
          maxPossiblePoints: 4,
          scoreCalculation: "4 / (2 × 2) × 100% = 100%"
        }
      }
    }
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  // Filter conversions based on search and influence filter
  const filteredConversions = conversionsData.filter(conversion => {
    const matchesSearch = searchTerm === '' || 
      conversion.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (conversion.teamMemberId && conversion.teamMemberId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      conversion.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (conversion.campaignName && conversion.campaignName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesInfluence = influenceFilter === INFLUENCE_FILTERS.ALL || 
      (influenceFilter === INFLUENCE_FILTERS.STRONG && conversion.adsInfluenceScore >= 76) ||
      (influenceFilter === INFLUENCE_FILTERS.SIGNIFICANT && conversion.adsInfluenceScore >= 51 && conversion.adsInfluenceScore <= 75) ||
      (influenceFilter === INFLUENCE_FILTERS.PARTIAL && conversion.adsInfluenceScore >= 26 && conversion.adsInfluenceScore <= 50) ||
      (influenceFilter === INFLUENCE_FILTERS.ORGANIC && conversion.adsInfluenceScore <= 25);
    
    return matchesSearch && matchesInfluence;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Conversions</h1>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {summaryData.totalConversions}
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ad Influenced</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {summaryData.adInfluencedCount}
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((summaryData.adInfluencedCount / summaryData.totalConversions) * 100)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Influence Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {summaryData.averageInfluenceScore}%
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              ${summaryData.totalRevenue}
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </div>
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

      {/* Conversions List */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6 flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </CardContent>
        </Card>
      ) : (
        <ConversionsList conversions={filteredConversions} />
      )}
    </div>
  );
};

export default ConversionsPage;
