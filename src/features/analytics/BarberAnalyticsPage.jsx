import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BarberAnalyticsSummary from "./components/BarberAnalyticsSummary";
import BarberManagement from "./components/BarberManagement";

const BarberAnalyticsPage = () => {
    // Tab state
    const [activeTab, setActiveTab] = useState("summary");

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-3xl font-bold">Barber Analytics</h1>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full md:w-[400px] grid-cols-2">
                    <TabsTrigger value="summary">Analytics Summary</TabsTrigger>
                    <TabsTrigger value="management">Team Management</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="mt-6">
                    {/* Render summary page only when this tab is active */}
                    {activeTab === "summary" && <BarberAnalyticsSummary />}
                </TabsContent>

                <TabsContent value="management" className="mt-6">
                    {/* Render management page only when this tab is active */}
                    {activeTab === "management" && <BarberManagement />}
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default BarberAnalyticsPage;
