import React, { useState, useEffect, useDeferredValue } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Search, RefreshCw } from "lucide-react";
import BarberAnalyticsList from "./BarberAnalyticsList";
import { useBarberAnalytics } from "../hooks/useBarberAnalytics";
import { useDebounce } from "@/hooks/useDebounce";
import dayjs from "dayjs";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import Pagination from "@/components/common/Pagination";

const BarberAnalyticsSummary = () => {
  // Page state
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [sortDir, setSortDir] = useState("desc");
  const [dateRange, setDateRange] = useState("30d");
  const [employmentType, setEmploymentType] = useState("all");

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
    let endDate = now.format("YYYY-MM-DD");

    switch (dateRange) {
      case "7d":
        startDate = now.subtract(7, "day").format("YYYY-MM-DD");
        break;
      case "30d":
        startDate = now.subtract(30, "day").format("YYYY-MM-DD");
        break;
      case "90d":
        startDate = now.subtract(90, "day").format("YYYY-MM-DD");
        break;
      case "all":
        // No start date for all time
        break;
      default:
        startDate = now.subtract(30, "day").format("YYYY-MM-DD");
    }

    return { startDate, endDate };
  };

  // Get hook for barber analytics
  const { barbers, meta, loading, error, fetchBarberAnalytics } =
    useBarberAnalytics({});

  // Add state for summary stats
  const [summaryStats, setSummaryStats] = useState({
    totalBarbers: 0,
    totalConversions: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalRepeatOrders: 0
  });

  // Fetch barber analytics when filters or pagination change
  useEffect(() => {
    const { startDate, endDate } = getDateRangeParams();

    const queryParams = {
      page: currentPage,
      size: 10,
      search: deferredSearchTerm || undefined,
      sortBy,
      sortDir,
      startDate,
      endDate,
      employmentType: employmentType !== "all" ? employmentType : undefined
    };

    fetchBarberAnalytics(queryParams).then((response) => {
      if (response && response.summary) {
        setSummaryStats(response.summary);
      }
    });
  }, [
    currentPage,
    deferredSearchTerm,
    sortBy,
    sortDir,
    dateRange,
    employmentType,
    fetchBarberAnalytics
  ]);

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
        endDate,
        employmentType: employmentType !== "all" ? employmentType : undefined
      };

      const response = await fetchBarberAnalytics(refreshParams);
      if (response && response.summary) {
        setSummaryStats(response.summary);
      }
    } catch (err) {
      console.error("Error refreshing data:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage !== 1) setCurrentPage(1);
  }, [sortBy, sortDir, dateRange, deferredSearchTerm, employmentType]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Analytics Summary</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Barber performance metrics and conversion tracking
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={loading || isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading || isRefreshing ? "animate-spin" : ""
            }`}
          />
          Refresh Data
        </Button>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Barbers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryStats.totalBarbers}
            </div>
            <p className="text-xs text-muted-foreground">
              {meta
                ? `Showing ${barbers.length} of ${meta.totalElements} on page`
                : "All active barbers"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Conversions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryStats.totalConversions}
            </div>
            <p className="text-xs text-muted-foreground">All conversions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${summaryStats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">All barbers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Order Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${summaryStats.averageOrderValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Per conversion</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Repeat Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summaryStats.totalRepeatOrders || 0}
            </div>
            <p className="text-xs text-muted-foreground">Within 3 months</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
        <div className="w-full md:w-1/3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by barber name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>

        <div className="flex flex-wrap gap-4">
          <Select
            value={`${sortBy}_${sortDir}`}
            onChange={(e) => {
              const [newSortBy, newSortDir] = e.target.value.split("_");
              setSortBy(newSortBy);
              setSortDir(newSortDir);
            }}
            className="w-full md:w-[280px]"
          >
            <option value="default_desc">
              Default (Employment → Conversions → Order)
            </option>
            <option value="displayOrder_asc">
              Sort by Display Order
            </option>
            <option value="totalConversions_desc">
              Sort by Conversions (High to Low)
            </option>
            <option value="totalConversions_asc">
              Sort by Conversions (Low to High)
            </option>
            <option value="totalRevenue_desc">
              Sort by Revenue (High to Low)
            </option>
            <option value="totalRevenue_asc">
              Sort by Revenue (Low to High)
            </option>
            <option value="barberName_asc">Sort by Name (A-Z)</option>
            <option value="barberName_desc">Sort by Name (Z-A)</option>
            <option value="employmentType_asc">Sort by Employment Type (A-Z)</option>
            <option value="employmentType_desc">Sort by Employment Type (Z-A)</option>
            <option value="lastBookingDate_desc">
              Sort by Last Booking (Recent)
            </option>
            <option value="lastBookingDate_asc">
              Sort by Last Booking (Oldest)
            </option>
          </Select>

          <Select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full md:w-[200px]"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="all">All time</option>
          </Select>

          <Select
            value={employmentType}
            onChange={(e) => setEmploymentType(e.target.value)}
            className="w-full md:w-[180px]"
          >
            <option value="all">All Employment Types</option>
            <option value="EMPLOYEE">Employees</option>
            <option value="CHAIR_RENTAL">Chair Rental</option>
          </Select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <ErrorMessage
          message={error.message || "Failed to load barber analytics"}
          onRetry={handleRefresh}
          className="mb-6"
        />
      )}

      {/* Barber Analytics List */}
      {loading ? (
        <Card>
          <CardContent className="p-6 flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="large" />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Top Barbers</CardTitle>
            <CardDescription>
              Barber performance and conversion history ({barbers.length}{" "}
              barbers)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarberAnalyticsList 
              barbers={barbers} 
              filterParams={{
                startDate: getDateRangeParams().startDate,
                endDate: getDateRangeParams().endDate,
                employmentType: employmentType !== "all" ? employmentType : undefined
              }}
            />
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

export default BarberAnalyticsSummary;