// src/features/dashboard-home/useDashboard.js
import { useState, useEffect } from "react";
import { dashboardService } from "./dashboardService";

/**
 * Hook for managing dashboard data
 * @param {Object} options - Query parameters
 * @returns {Object} Dashboard data and operations
 */
export function useDashboard(options = {}) {
    const [summary, setSummary] = useState({
        totalConversions: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        averageOrderValue: 0,
        conversionRate: 0,
        revenueGrowth: 0,
        period: null,
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [topPerformers, setTopPerformers] = useState({
        topCustomers: [],
        topBarbers: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch dashboard summary
    const fetchSummary = async (params = {}) => {
        try {
            const response = await dashboardService.getDashboardSummary(params);
            if (response.status === "OK" && response.data) {
                setSummary(response.data);
            }
        } catch (err) {
            console.error("Error fetching dashboard summary:", err);
            throw err;
        }
    };

    // Fetch recent activity
    const fetchRecentActivity = async (params = {}) => {
        try {
            // Extract source from params if available
            const { source, ...otherParams } = params;
            const activityParams = { ...otherParams };
            if (source) {
                activityParams.source = source;
            }
            const response = await dashboardService.getRecentActivity(activityParams);
            if (response.status === "OK" && response.data) {
                setRecentActivity(response.data);
            }
        } catch (err) {
            console.error("Error fetching recent activity:", err);
            throw err;
        }
    };

    // Fetch top performers
    const fetchTopPerformers = async (params = {}) => {
        try {
            const response = await dashboardService.getTopPerformers(params);
            if (response.status === "OK" && response.data) {
                setTopPerformers(response.data);
            }
        } catch (err) {
            console.error("Error fetching top performers:", err);
            throw err;
        }
    };

    // Fetch all dashboard data
    const fetchDashboardData = async (params = {}) => {
        setLoading(true);
        setError(null);

        try {
            await Promise.all([
                fetchSummary(params),
                fetchRecentActivity({ limit: 10, ...params }),
                fetchTopPerformers({ limit: 5, ...params }),
            ]);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Failed to fetch dashboard data"));
            console.error("Error fetching dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    // Auto-fetch on mount
    useEffect(() => {
        fetchDashboardData(options);
    }, []); // Only run on mount

    return {
        summary,
        recentActivity,
        topPerformers,
        loading,
        error,
        fetchDashboardData,
        fetchSummary,
        fetchRecentActivity,
        fetchTopPerformers,
    };
}
