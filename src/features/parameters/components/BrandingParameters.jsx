import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const BrandingParameters = () => {
    const [appName, setAppName] = useState("Barber Dashboard");
    const [appLogo, setAppLogo] = useState("/logo.svg");
    const [faviconUrl, setFaviconUrl] = useState("/favicon.ico");

    return (
        <Card>
            <CardHeader>
                <CardTitle>Application Branding</CardTitle>
                <CardDescription>Configure logos, icons, and application identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-3">
                    <label className="text-sm font-medium">Application Name</label>
                    <Input
                        value={appName}
                        onChange={(e) => setAppName(e.target.value)}
                        placeholder="Enter application name"
                    />
                    <p className="text-xs text-muted-foreground">Displayed in the browser tab and dashboard header</p>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-medium">Logo URL</label>
                    <Input value={appLogo} onChange={(e) => setAppLogo(e.target.value)} placeholder="/logo.svg" />
                    <p className="text-xs text-muted-foreground">
                        Path to the main application logo (SVG or PNG recommended)
                    </p>
                </div>

                <div className="space-y-3">
                    <label className="text-sm font-medium">Favicon URL</label>
                    <Input
                        value={faviconUrl}
                        onChange={(e) => setFaviconUrl(e.target.value)}
                        placeholder="/favicon.ico"
                    />
                    <p className="text-xs text-muted-foreground">Path to the favicon icon file</p>
                </div>

                {/* Logo Preview */}
                <div className="border rounded-lg p-6 space-y-4">
                    <h4 className="text-sm font-medium">Logo Preview</h4>
                    <div className="flex items-center gap-6">
                        <div className="bg-black rounded-lg p-3">
                            <img src={appLogo} alt="Logo Preview" className="h-12 w-auto" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-medium">{appName}</p>
                            <p className="text-xs text-muted-foreground">Logo on dark background</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default BrandingParameters;
