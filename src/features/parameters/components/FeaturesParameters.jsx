import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, Eye, EyeOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleFeature } from "../store/parametersSlice";
import { selectFeatures } from "../store/selectors";

const FeaturesParameters = () => {
    const dispatch = useAppDispatch();
    const features = useAppSelector(selectFeatures);

    const { maintenanceMode, showAnalytics, allowRegistration, darkModeEnabled } = features;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Feature Flags</CardTitle>
                    <CardDescription>Enable or disable specific features and functionality</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Maintenance Mode */}
                    <div className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-medium">Maintenance Mode</h4>
                                <Badge variant={maintenanceMode ? "destructive" : "secondary"}>
                                    {maintenanceMode ? "Active" : "Inactive"}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                When enabled, displays a maintenance message to all users
                            </p>
                        </div>
                        <Button
                            variant={maintenanceMode ? "destructive" : "outline"}
                            size="sm"
                            onClick={() => dispatch(toggleFeature("maintenanceMode"))}
                            className="ml-4"
                        >
                            {maintenanceMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                            {maintenanceMode ? "Disable" : "Enable"}
                        </Button>
                    </div>

                    {/* Show Analytics */}
                    <div className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-medium">Analytics Dashboard</h4>
                                <Badge variant={showAnalytics ? "default" : "secondary"}>
                                    {showAnalytics ? "Enabled" : "Disabled"}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Control visibility of analytics and reporting features
                            </p>
                        </div>
                        <Button
                            variant={showAnalytics ? "default" : "outline"}
                            size="sm"
                            onClick={() => dispatch(toggleFeature("showAnalytics"))}
                            className="ml-4"
                        >
                            {showAnalytics ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                            {showAnalytics ? "Enabled" : "Disabled"}
                        </Button>
                    </div>

                    {/* User Registration */}
                    <div className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-medium">User Registration</h4>
                                <Badge variant={allowRegistration ? "default" : "secondary"}>
                                    {allowRegistration ? "Open" : "Closed"}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Allow new users to create accounts via the registration page
                            </p>
                        </div>
                        <Button
                            variant={allowRegistration ? "default" : "outline"}
                            size="sm"
                            onClick={() => dispatch(toggleFeature("allowRegistration"))}
                            className="ml-4"
                        >
                            {allowRegistration ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                            {allowRegistration ? "Enabled" : "Disabled"}
                        </Button>
                    </div>

                    {/* Dark Mode */}
                    <div className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="space-y-1 flex-1">
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-medium">Dark Mode Support</h4>
                                <Badge variant={darkModeEnabled ? "default" : "secondary"}>
                                    {darkModeEnabled ? "Available" : "Disabled"}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Enable or disable dark mode theme switching for users
                            </p>
                        </div>
                        <Button
                            variant={darkModeEnabled ? "default" : "outline"}
                            size="sm"
                            onClick={() => dispatch(toggleFeature("darkModeEnabled"))}
                            className="ml-4"
                        >
                            {darkModeEnabled ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                            {darkModeEnabled ? "Enabled" : "Disabled"}
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20">
                <CardContent className="flex items-start gap-3 pt-6">
                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Feature Flag Guidelines</p>
                        <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                            Feature flags take effect immediately after saving. Users may need to refresh their browser
                            to see changes. Consider notifying users before enabling maintenance mode.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default FeaturesParameters;
