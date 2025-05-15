import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, TrendingUp, DollarSign, Users } from 'lucide-react';
import { Select } from '@/components/ui/select';
import { DATE_RANGES } from '../constants/conversionConstants';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';

const ConversionsSummary = ({ 
  summaryData, 
  summaryLoading, 
  summaryError, 
  dateRange, 
  setDateRange, 
  onRetry 
}) => {
  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <div className="flex justify-end">
        <Select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="w-full max-w-[200px]"
        >
          <option value={DATE_RANGES.LAST_7_DAYS}>Last 7 days</option>
          <option value={DATE_RANGES.LAST_30_DAYS}>Last 30 days</option>
          <option value={DATE_RANGES.LAST_90_DAYS}>Last 90 days</option>
          <option value={DATE_RANGES.ALL_TIME}>All time</option>
        </Select>
      </div>

      {/* Summary Error */}
      {summaryError && (
        <ErrorMessage 
          message={summaryError.message || 'Failed to load summary data'} 
          onRetry={onRetry}
        />
      )}

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
                {summaryData.totalConversions}
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
                  {summaryData.adInfluencedCount}
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
                {summaryData.totalConversions > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {summaryData.adInfluencedCount > 0 ? 
                      `${Math.round((summaryData.adInfluencedCount / summaryData.totalConversions) * 100)}% of total` : 
                      '0% of total'}
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
                {summaryData.averageInfluenceScore}%
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
                ${typeof summaryData.totalRevenue === 'number' ? 
                  Math.round(summaryData.totalRevenue).toLocaleString() : '0'}
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional summary data can be added here, like source breakdown or charts */}
      {!summaryLoading && summaryData && summaryData.influenceLevelBreakdown && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Influence Level Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-2">Influence Level</th>
                    <th className="text-right pb-2">Count</th>
                    <th className="text-right pb-2">Percentage</th>
                    <th className="text-right pb-2">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryData.influenceLevelBreakdown.map((level, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="py-2">{level.level}</td>
                      <td className="py-2 text-right">{level.count}</td>
                      <td className="py-2 text-right">{level.percentage}%</td>
                      <td className="py-2 text-right">${Math.round(level.revenue).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConversionsSummary;