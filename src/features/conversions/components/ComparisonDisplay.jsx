import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const ComparisonDisplay = ({ currentData, previousData, periodLabel }) => {
    // Calculate percentage changes
    const calculateChange = (current, previous) => {
        if (!previous || previous === 0) return { value: 0, isIncrease: true };
        const percentChange = ((current - previous) / previous) * 100;
        return {
            value: Math.abs(percentChange),
            isIncrease: percentChange >= 0,
        };
    };

    const adInfluencedChange = calculateChange(currentData.adInfluencedCount, previousData.adInfluencedCount);

    const revenueChange = calculateChange(currentData.adsRevenue || 0, previousData.adsRevenue || 0);

    const getChangeIcon = (change) => {
        if (change.value === 0) {
            return <Minus className="h-4 w-4 text-gray-500" />;
        }
        return change.isIncrease ? (
            <TrendingUp className="h-4 w-4 text-green-600" />
        ) : (
            <TrendingDown className="h-4 w-4 text-red-600" />
        );
    };

    const getChangeColor = (change) => {
        if (change.value === 0) return "text-gray-600";
        return change.isIncrease ? "text-green-600" : "text-red-600";
    };

    return (
        <div className="space-y-4">
            {/* Ad Influenced Comparison */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Ad Influenced</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Current Period</p>
                            <p className="text-2xl font-bold">{currentData.adInfluencedCount}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {currentData.totalConversions > 0
                                    ? `${Math.round((currentData.adInfluencedCount / currentData.totalConversions) * 100)}% of total`
                                    : "0% of total"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">{periodLabel}</p>
                            <p className="text-2xl font-bold text-muted-foreground">{previousData.adInfluencedCount}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {previousData.totalConversions > 0
                                    ? `${Math.round((previousData.adInfluencedCount / previousData.totalConversions) * 100)}% of total`
                                    : "0% of total"}
                            </p>
                        </div>
                    </div>

                    {/* Change indicator */}
                    <div className={`flex items-center gap-2 mt-4 pt-4 border-t ${getChangeColor(adInfluencedChange)}`}>
                        {getChangeIcon(adInfluencedChange)}
                        <span className="text-sm font-medium">
                            {adInfluencedChange.value.toFixed(1)}%{" "}
                            {adInfluencedChange.isIncrease ? "increase" : "decrease"}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Ads Revenue Comparison */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Ads Infl. Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">Current Period</p>
                            <p className="text-2xl font-bold">
                                ${Math.round(currentData.adsRevenue || 0).toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {currentData.totalRevenue > 0
                                    ? `${Math.round(((currentData.adsRevenue || 0) / currentData.totalRevenue) * 100)}% of revenue`
                                    : "0% of revenue"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground mb-1">{periodLabel}</p>
                            <p className="text-2xl font-bold text-muted-foreground">
                                ${Math.round(previousData.adsRevenue || 0).toLocaleString()}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {previousData.totalRevenue > 0
                                    ? `${Math.round(((previousData.adsRevenue || 0) / previousData.totalRevenue) * 100)}% of revenue`
                                    : "0% of revenue"}
                            </p>
                        </div>
                    </div>

                    {/* Change indicator */}
                    <div className={`flex items-center gap-2 mt-4 pt-4 border-t ${getChangeColor(revenueChange)}`}>
                        {getChangeIcon(revenueChange)}
                        <span className="text-sm font-medium">
                            {revenueChange.value.toFixed(1)}% {revenueChange.isIncrease ? "increase" : "decrease"}
                        </span>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-4 text-sm">
                <Card>
                    <CardContent className="pt-4">
                        <p className="text-muted-foreground mb-1">Total Conversions</p>
                        <p className="font-semibold">
                            Current: {currentData.totalConversions} | Previous: {previousData.totalConversions}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4">
                        <p className="text-muted-foreground mb-1">Avg. Influence Score</p>
                        <p className="font-semibold">
                            Current: {currentData.averageInfluenceScore}% | Previous:{" "}
                            {previousData.averageInfluenceScore}%
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ComparisonDisplay;
