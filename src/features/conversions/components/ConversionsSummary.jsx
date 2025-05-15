import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, TrendingUp, DollarSign, Users } from 'lucide-react';
import { Select } from '@/components/ui/select';
import { DATE_RANGES, CHART_COLORS, SOURCE_TYPES } from '../constants/conversionConstants';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ErrorMessage from '@/components/common/ErrorMessage';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from 'recharts';

// Custom label renderer for pie chart with external labels
const renderCustomizedLabel = (props) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, index, value, name, fill } = props;
  
  // Skip labels for very small segments
  if (percent < 0.05) return null;
  
  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  
  // Starting point of the line (on the outer edge of the pie)
  const sx = cx + outerRadius * cos;
  const sy = cy + outerRadius * sin;
  
  // Ending point of the line (extend further for better spacing)
  const ex = cx + (outerRadius + 45) * cos;
  const ey = cy + (outerRadius + 45) * sin;
  
  // Text position and anchor (more spacing from end of line)
  const tx = ex + (cos >= 0 ? 12 : -12);
  const ty = ey;
  const textAnchor = cos >= 0 ? 'start' : 'end';
  
  // Intermediate point for curved or angled line
  const mx = cx + (outerRadius + 15) * cos;
  const my = cy + (outerRadius + 15) * sin;
  
  return (
    <g>
      {/* Line from pie to label */}
      <path 
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} 
        stroke={fill} 
        fill="none" 
        strokeWidth={1.5} 
      />
      
      {/* Small dot at the end of the line */}
      <circle 
        cx={ex} 
        cy={ey} 
        r={2.5} 
        fill={fill} 
        stroke="none" 
      />
      
      {/* Percentage text */}
      <text 
        x={tx} 
        y={ty} 
        textAnchor={textAnchor} 
        fill="currentColor"
        fontSize={13}
        fontWeight="600"
        dominantBaseline="middle"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    </g>
  );
};

// Custom tooltip component
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0].payload;
  const color = payload[0].color;
  
  return (
    <div className="bg-card border border-border p-3 rounded-md shadow-md">
      <p className="font-medium mb-1 flex items-center">
        <span className="inline-block w-3 h-3 mr-2 rounded-full" style={{ backgroundColor: color }}></span>
        {data.level}
      </p>
      <p className="text-muted-foreground text-xs">
        <strong>{data.count}</strong> conversion{data.count !== 1 ? 's' : ''} ({data.percentage}%)
      </p>
      <p className="text-muted-foreground text-xs">
        Revenue: <strong>${Math.round(data.revenue).toLocaleString()}</strong>
      </p>
    </div>
  );
};

const ConversionsSummary = ({ 
  summaryData, 
  summaryLoading, 
  summaryError, 
  dateRange, 
  setDateRange, 
  sourceFilter = 'all',
  setSourceFilter = () => {},
  onRetry 
}) => {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap justify-start gap-4">
        {/* Date Range Filter */}
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
        
        {/* Source Filter */}
        <Select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="w-full max-w-[200px]"
        >
          <option value="all">All Sources</option>
          <option value={SOURCE_TYPES.WEBSITE}>Website</option>
          <option value={SOURCE_TYPES.NON_WEB}>Non-web</option>
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

      {/* Influence Level Breakdown Chart */}
      {!summaryLoading && summaryData && summaryData.influenceLevelBreakdown && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Influence Level Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="h-96 flex items-center justify-center" aria-label="Influence Level Distribution Pie Chart">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={{ top: 40, right: 80, bottom: 30, left: 80 }}>
                    <Pie
                      data={summaryData.influenceLevelBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="level"
                      paddingAngle={2}
                    >
                      {summaryData.influenceLevelBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={<CustomTooltip />}
                    />
                    <Legend 
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      iconSize={12}
                      iconType="circle"
                      formatter={(value, entry) => (
                        <span className="text-foreground text-sm">{value}</span>
                      )}
                      wrapperStyle={{
                        paddingTop: 20,
                        marginBottom: 10
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Details Table */}
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
                        <td className="py-2 flex items-center">
                          <span 
                            className="inline-block w-3 h-3 mr-2 rounded-full" 
                            style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
                          ></span>
                          {level.level}
                        </td>
                        <td className="py-2 text-right">{level.count}</td>
                        <td className="py-2 text-right">{level.percentage}%</td>
                        <td className="py-2 text-right">${Math.round(level.revenue).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConversionsSummary;