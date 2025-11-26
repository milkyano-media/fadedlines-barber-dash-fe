import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { RefreshCw } from "lucide-react";
import CampaignList from "./components/CampaignList";
import { useCampaigns } from "./hooks/useCampaigns";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import Pagination from "@/components/common/Pagination";

const CampaignsPage = () => {
    // Page state
    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("conversions");
    const [sortDir, setSortDir] = useState("desc");

    // State for manual refresh status
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Get hook for campaigns
    const { campaigns, meta, loading, error, fetchCampaigns } = useCampaigns({});

    // Fetch campaigns when filters or pagination change
    useEffect(() => {
        const queryParams = {
            page: currentPage,
            size: 10,
            sortBy,
            sortDir,
        };

        fetchCampaigns(queryParams);
    }, [currentPage, sortBy, sortDir, fetchCampaigns]);

    // Handle refresh
    const handleRefresh = async () => {
        if (isRefreshing) return;

        setIsRefreshing(true);
        try {
            setCurrentPage(1);

            const refreshParams = {
                page: 1,
                size: 10,
                sortBy,
                sortDir,
            };

            await fetchCampaigns(refreshParams);
        } catch (err) {
            console.error("Error refreshing data:", err);
        } finally {
            setIsRefreshing(false);
        }
    };

    // Reset to page 1 when filters change
    useEffect(() => {
        if (currentPage !== 1) setCurrentPage(1);
    }, [sortBy, sortDir]);

    // Calculate summary statistics
    const totalConversions = campaigns.reduce((sum, campaign) => sum + campaign.totalConversions, 0);
    const totalRevenue = campaigns.reduce((sum, campaign) => sum + campaign.totalRevenue, 0);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Campaign Analytics</h1>
                <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={loading || isRefreshing}
                    className="flex items-center gap-2"
                >
                    <RefreshCw className={`h-4 w-4 ${loading || isRefreshing ? "animate-spin" : ""}`} />
                    Refresh Data
                </Button>
            </div>

            {/* Summary Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{campaigns.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalConversions}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters Section */}
            <div className="flex flex-col md:flex-row gap-4 justify-end">
                <Select
                    value={`${sortBy}_${sortDir}`}
                    onChange={(e) => {
                        const [newSortBy, newSortDir] = e.target.value.split("_");
                        setSortBy(newSortBy);
                        setSortDir(newSortDir);
                    }}
                    className="w-full md:w-[280px]"
                >
                    <option value="conversions_desc">Sort by Conversions (High to Low)</option>
                    <option value="conversions_asc">Sort by Conversions (Low to High)</option>
                    <option value="revenue_desc">Sort by Revenue (High to Low)</option>
                    <option value="revenue_asc">Sort by Revenue (Low to High)</option>
                    <option value="name_asc">Sort by Name (A-Z)</option>
                    <option value="name_desc">Sort by Name (Z-A)</option>
                </Select>
            </div>

            {/* Error Message */}
            {error && (
                <ErrorMessage
                    message={error.message || "Failed to load campaigns"}
                    onRetry={handleRefresh}
                    className="mb-6"
                />
            )}

            {/* Campaigns List */}
            {loading ? (
                <Card>
                    <CardContent className="p-6 flex items-center justify-center min-h-[400px]">
                        <LoadingSpinner size="large" />
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>Marketing Campaigns</CardTitle>
                        <CardDescription>
                            Track performance metrics for your marketing campaigns ({campaigns.length} campaigns)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CampaignList campaigns={campaigns} />
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

export default CampaignsPage;
