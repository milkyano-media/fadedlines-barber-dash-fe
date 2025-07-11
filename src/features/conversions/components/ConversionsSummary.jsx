import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  HelpCircle
} from "lucide-react";
import { Select } from "@/components/ui/select";
import { Popover } from "@/components/ui/popover";
import { CHART_COLORS, SOURCE_TYPES } from "../constants/conversionConstants";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";

// Store previous label positions to avoid overlap
let labelPositions = [];

// Simple label renderer for mobile - shows percentage inside slices
const renderMobileLabel = (props) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;

  if (percent < 0.05) return null; // Hide labels for very small slices

  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-RADIAN * midAngle);
  const y = cy + radius * Math.sin(-RADIAN * midAngle);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-xs font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Custom label renderer for pie chart with external labels
const renderCustomizedLabel = (props) => {
  const { cx, cy, midAngle, outerRadius, percent, index, fill, payload } =
    props;

  // Reset positions for first label
  if (index === 0) labelPositions = [];

  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);

  // Starting point of the line (on the outer edge of the pie)
  const sx = cx + outerRadius * cos;
  const sy = cy + outerRadius * sin;

  // For small segments, extend the line further to avoid overlap
  const lineExtension = percent < 0.01 ? 90 : percent < 0.05 ? 70 : 45;
  const labelOffset = percent < 0.05 ? 20 : 12;

  // Ending point of the line (extend further for better spacing)
  const ex = cx + (outerRadius + lineExtension) * cos;
  let ey = cy + (outerRadius + lineExtension) * sin;

  // Text position and anchor (more spacing from end of line)
  const tx = ex + (cos >= 0 ? labelOffset : -labelOffset);
  let ty = ey;

  // Check for overlap with previous labels and adjust
  const minDistance = 35; // Minimum vertical distance between labels
  for (const pos of labelPositions) {
    if (Math.abs(pos.x - tx) < 100) {
      // If horizontally close
      const verticalDistance = Math.abs(pos.y - ty);
      if (verticalDistance < minDistance) {
        // Adjust position based on which side we're on
        if (cos >= 0) {
          // Right side
          ty = pos.y + (ty > pos.y ? minDistance : -minDistance);
        } else {
          // Left side
          ty = pos.y + (ty > pos.y ? minDistance : -minDistance);
        }
      }
    }
  }

  // Store this label's position
  labelPositions.push({ x: tx, y: ty });

  const textAnchor = cos >= 0 ? "start" : "end";

  // Intermediate point for curved or angled line
  const mx = cx + (outerRadius + 15) * cos;
  const my = cy + (outerRadius + 15) * sin;

  return (
    <g>
      {/* Line from pie to label */}
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}L${
          tx - (cos >= 0 ? labelOffset - 5 : -labelOffset + 5)
        },${ty}`}
        stroke={fill}
        fill="none"
        strokeWidth={1.5}
      />

      {/* Small dot at the end of the line */}
      <circle
        cx={tx - (cos >= 0 ? labelOffset - 5 : -labelOffset + 5)}
        cy={ty}
        r={2.5}
        fill={fill}
        stroke="none"
      />

      {/* Label text - influence level name */}
      <text
        x={tx}
        y={ty - 8}
        textAnchor={textAnchor}
        fill="currentColor"
        fontSize={12}
        dominantBaseline="middle"
      >
        {payload.level}
      </text>

      {/* Percentage text */}
      <text
        x={tx}
        y={ty + 8}
        textAnchor={textAnchor}
        fill="currentColor"
        fontSize={13}
        fontWeight="600"
        dominantBaseline="middle"
      >
        {`${(percent * 100).toFixed(1)}%`}
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
        <span
          className="inline-block w-3 h-3 mr-2 rounded-full"
          style={{ backgroundColor: color }}
        ></span>
        {data.level}
      </p>
      <p className="text-muted-foreground text-xs">
        <strong>{data.count}</strong> conversion{data.count !== 1 ? "s" : ""} (
        {data.percentage}%)
      </p>
      <p className="text-muted-foreground text-xs">
        Avg Influence: <strong>{data.averageScore || 0}%</strong>
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
  sourceFilter = "all",
  setSourceFilter = () => {},
  onRetry
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="space-y-6">
      {/* Source Filter */}
      <div className="flex flex-wrap justify-start gap-4">
        <Select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
          className="w-full max-w-[200px]"
        >
          <option value={SOURCE_TYPES.WEBSITE}>Website</option>
          <option value={SOURCE_TYPES.NON_WEB}>Non-web</option>
          <option value="all">All Sources</option>
        </Select>
      </div>

      {/* Summary Error */}
      {summaryError && (
        <ErrorMessage
          message={summaryError.message || "Failed to load summary data"}
          onRetry={onRetry}
        />
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Total Conversions
              <Popover content="Total number of completed bookings/sales in the selected date range.">
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
              </Popover>
            </CardTitle>
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
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Ad Influenced
              <Popover
                content={
                  <div>
                    <p className="font-medium mb-2">
                      Conversions with ad influence &gt;25%
                    </p>
                    <p className="text-xs text-muted-foreground mb-1">
                      Includes:
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-0.5">
                      <li>• Strongly influenced (≥76%)</li>
                      <li>• Significantly influenced (≥51%)</li>
                      <li>• Partially influenced (≥26%)</li>
                    </ul>
                  </div>
                }
              >
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
              </Popover>
            </CardTitle>
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
                    {summaryData.adInfluencedCount > 0
                      ? `${Math.round(
                          (summaryData.adInfluencedCount /
                            summaryData.totalConversions) *
                            100
                        )}% of total`
                      : "0% of total"}
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Average Influence Score
              <Popover content="Average percentage of ad influence across all conversions (0-100%).">
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
              </Popover>
            </CardTitle>
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
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Total Revenue
              <Popover content="Total revenue from all conversions in the selected date range.">
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
              </Popover>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <LoadingSpinner size="small" />
            ) : (
              <div className="text-2xl font-bold flex items-center gap-2">
                $
                {typeof summaryData.totalRevenue === "number"
                  ? Math.round(summaryData.totalRevenue).toLocaleString()
                  : "0"}
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              Ads Infl. Revenue
              <Popover
                content={
                  <div>
                    <p className="font-medium mb-2">
                      Revenue from conversions with ad influence &gt;25%
                    </p>
                    <p className="text-xs text-muted-foreground mb-1">
                      Includes:
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-0.5">
                      <li>• Strongly influenced (≥76%)</li>
                      <li>• Significantly influenced (≥51%)</li>
                      <li>• Partially influenced (≥26%)</li>
                    </ul>
                  </div>
                }
              >
                <HelpCircle className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground transition-colors" />
              </Popover>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {summaryLoading ? (
              <LoadingSpinner size="small" />
            ) : (
              <>
                <div className="text-2xl font-bold flex items-center gap-2">
                  $
                  {typeof summaryData.adsRevenue === "number"
                    ? Math.round(summaryData.adsRevenue).toLocaleString()
                    : "0"}
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                {summaryData.totalRevenue > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {summaryData.adsRevenue > 0
                      ? `${Math.round(
                          (summaryData.adsRevenue / summaryData.totalRevenue) *
                            100
                        )}% of revenue`
                      : "0% of revenue"}
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Influence Level Breakdown Chart */}
      {!summaryLoading &&
        summaryData &&
        summaryData.influenceLevelBreakdown && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Influence Level Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6">
                {/* Pie Chart */}
                <div
                  className={`${
                    isMobile ? "h-64" : "h-96"
                  } flex items-center justify-center`}
                  aria-label="Influence Level Distribution Pie Chart"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart
                      margin={
                        isMobile
                          ? { top: 20, right: 20, bottom: 60, left: 20 }
                          : { top: 60, right: 150, bottom: 30, left: 60 }
                      }
                    >
                      <Pie
                        data={summaryData.influenceLevelBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={
                          isMobile ? renderMobileLabel : renderCustomizedLabel
                        }
                        outerRadius={isMobile ? 70 : 80}
                        innerRadius={isMobile ? 35 : 40}
                        fill="#8884d8"
                        dataKey="count"
                        nameKey="level"
                        paddingAngle={2}
                      >
                        {summaryData.influenceLevelBreakdown.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={CHART_COLORS[index % CHART_COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        layout="horizontal"
                        verticalAlign="bottom"
                        align="center"
                        iconSize={isMobile ? 10 : 12}
                        iconType="circle"
                        formatter={(value) => (
                          <span
                            className={`text-foreground ${
                              isMobile ? "text-xs" : "text-sm"
                            }`}
                          >
                            {value}
                          </span>
                        )}
                        wrapperStyle={{
                          paddingTop: isMobile ? 10 : 20,
                          marginBottom: isMobile ? 0 : 10
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Details Table */}
                <div className={`${isMobile ? "mt-6" : "mt-0"}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[600px] text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left pb-2 pr-4 whitespace-nowrap">
                              Influence Level
                            </th>
                            <th className="text-right pb-2 px-4 whitespace-nowrap">
                              Count
                            </th>
                            <th className="text-right pb-2 px-4 whitespace-nowrap">
                              Percentage
                            </th>
                            <th className="text-right pb-2 px-4 whitespace-nowrap">
                              Avg Influence
                            </th>
                            <th className="text-right pb-2 pl-4 whitespace-nowrap">
                              Revenue
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {summaryData.influenceLevelBreakdown.map(
                            (level, index) => (
                              <tr
                                key={index}
                                className="border-b last:border-0"
                              >
                                <td className="py-2 pr-4">
                                  <div className="flex items-center">
                                    <span
                                      className="inline-block w-3 h-3 mr-2 rounded-full flex-shrink-0"
                                      style={{
                                        backgroundColor:
                                          CHART_COLORS[
                                            index % CHART_COLORS.length
                                          ]
                                      }}
                                    ></span>
                                    <span className="whitespace-nowrap">
                                      {level.level}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-2 px-4 text-right whitespace-nowrap">
                                  {level.count}
                                </td>
                                <td className="py-2 px-4 text-right whitespace-nowrap">
                                  {Number(level.percentage).toFixed(1)}%
                                </td>
                                <td className="py-2 px-4 text-right whitespace-nowrap">
                                  {level.averageScore || 0}%
                                </td>
                                <td className="py-2 pl-4 text-right font-medium whitespace-nowrap">
                                  ${Math.round(level.revenue).toLocaleString()}
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  );
};

export default ConversionsSummary;
