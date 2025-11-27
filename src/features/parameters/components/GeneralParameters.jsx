import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const GeneralParameters = () => {
    const [timezone, setTimezone] = useState("UTC");

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Application-wide configuration and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Default Timezone</label>
                        <Select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                            <option value="UTC">UTC (Coordinated Universal Time)</option>
                            <option value="America/New_York">Eastern Time (ET)</option>
                            <option value="America/Chicago">Central Time (CT)</option>
                            <option value="America/Denver">Mountain Time (MT)</option>
                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                            <option value="Europe/London">London (GMT)</option>
                            <option value="Europe/Paris">Paris (CET)</option>
                            <option value="Asia/Tokyo">Tokyo (JST)</option>
                            <option value="Australia/Sydney">Sydney (AEST)</option>
                        </Select>
                        <p className="text-xs text-muted-foreground">Default timezone for displaying dates and times</p>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium">API Base URL</label>
                        <Input value="http://localhost:3001" placeholder="http://localhost:3001" disabled />
                        <p className="text-xs text-muted-foreground">
                            Backend API endpoint (configured via environment variables)
                        </p>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium">Session Timeout (minutes)</label>
                        <Input type="number" defaultValue="60" placeholder="60" />
                        <p className="text-xs text-muted-foreground">
                            Automatic logout after specified minutes of inactivity
                        </p>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium">Items Per Page</label>
                        <Select defaultValue="20">
                            <option value="10">10 items</option>
                            <option value="20">20 items</option>
                            <option value="50">50 items</option>
                            <option value="100">100 items</option>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            Default number of items to display in paginated lists
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Data & Privacy</CardTitle>
                    <CardDescription>Configure data retention and privacy settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Analytics Data Retention (days)</label>
                        <Input type="number" defaultValue="90" placeholder="90" />
                        <p className="text-xs text-muted-foreground">
                            Number of days to retain analytics and reporting data
                        </p>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium">Event Log Retention (days)</label>
                        <Input type="number" defaultValue="30" placeholder="30" />
                        <p className="text-xs text-muted-foreground">
                            Number of days to retain event logs before archival
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default GeneralParameters;
