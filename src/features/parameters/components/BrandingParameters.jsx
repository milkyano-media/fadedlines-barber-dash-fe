import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateBranding } from "../store/parametersSlice";
import { selectBranding } from "../store/selectors";

const BrandingParameters = () => {
    const dispatch = useAppDispatch();
    const branding = useAppSelector(selectBranding);

    const { appName, appLogo, logoFileName, faviconUrl, faviconFileName } = branding;

    // Handle logo file upload
    const handleLogoUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            // Create a URL for preview
            const fileUrl = URL.createObjectURL(file);
            dispatch(updateBranding({ appLogo: fileUrl, logoFileName: file.name }));
        }
    };

    // Handle favicon file upload
    const handleFaviconUpload = (event) => {
        const file = event.target.files?.[0];
        if (file) {
            // Create a URL for preview
            const fileUrl = URL.createObjectURL(file);
            dispatch(updateBranding({ faviconUrl: fileUrl, faviconFileName: file.name }));
        }
    };

    // Clear logo
    const clearLogo = () => {
        dispatch(updateBranding({ appLogo: "/logo.svg", logoFileName: "" }));
    };

    // Clear favicon
    const clearFavicon = () => {
        dispatch(updateBranding({ faviconUrl: "/favicon.ico", faviconFileName: "" }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Application Branding</CardTitle>
                <CardDescription>Configure logos, icons, and application identity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Application Name */}
                <div className="space-y-3">
                    <label className="text-sm font-medium">Application Name</label>
                    <Input
                        value={appName}
                        onChange={(e) => dispatch(updateBranding({ appName: e.target.value }))}
                        placeholder="Enter application name"
                    />
                    <p className="text-xs text-muted-foreground">Displayed in the browser tab and dashboard header</p>
                </div>

                {/* Logo Upload */}
                <div className="space-y-3">
                    <label className="text-sm font-medium">Application Logo</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="file"
                            id="logo-upload"
                            accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/webp"
                            onChange={handleLogoUpload}
                            className="hidden"
                        />
                        <label htmlFor="logo-upload" className="flex-1">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2"
                                onClick={() => document.getElementById("logo-upload")?.click()}
                            >
                                <Upload className="h-4 w-4" />
                                {logoFileName ? "Change Logo" : "Upload Logo"}
                            </Button>
                        </label>
                        {logoFileName && (
                            <Button variant="ghost" size="icon" onClick={clearLogo}>
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    {logoFileName && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <ImageIcon className="h-3 w-3" />
                            <span>{logoFileName}</span>
                        </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Upload your application logo (SVG, PNG, JPG, or WebP recommended)
                    </p>
                </div>

                {/* Favicon Upload */}
                <div className="space-y-3">
                    <label className="text-sm font-medium">Favicon</label>
                    <div className="flex items-center gap-3">
                        <input
                            type="file"
                            id="favicon-upload"
                            accept="image/x-icon,image/png,image/jpeg,image/jpg,image/svg+xml"
                            onChange={handleFaviconUpload}
                            className="hidden"
                        />
                        <label htmlFor="favicon-upload" className="flex-1">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full flex items-center justify-center gap-2"
                                onClick={() => document.getElementById("favicon-upload")?.click()}
                            >
                                <Upload className="h-4 w-4" />
                                {faviconFileName ? "Change Favicon" : "Upload Favicon"}
                            </Button>
                        </label>
                        {faviconFileName && (
                            <Button variant="ghost" size="icon" onClick={clearFavicon}>
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    {faviconFileName && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <ImageIcon className="h-3 w-3" />
                            <span>{faviconFileName}</span>
                        </div>
                    )}
                    <p className="text-xs text-muted-foreground">
                        Upload favicon icon (ICO, PNG, or SVG format, 16x16 or 32x32 pixels recommended)
                    </p>
                </div>

                {/* Logo Preview */}
                <div className="border rounded-lg p-6 space-y-4">
                    <h4 className="text-sm font-medium mb-4">Preview</h4>

                    {/* Logo Preview on Dark Background */}
                    <div className="space-y-3">
                        <p className="text-xs text-muted-foreground">Logo on dark background</p>
                        <div className="flex items-center gap-6">
                            <div className="bg-black rounded-lg p-4 border-2">
                                <img
                                    src={appLogo}
                                    alt="Logo Preview"
                                    className="h-12 w-auto max-w-[200px]"
                                    onError={(e) => {
                                        e.currentTarget.src = "/logo.svg";
                                    }}
                                />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium">{appName}</p>
                                <p className="text-xs text-muted-foreground">Main logo display</p>
                            </div>
                        </div>
                    </div>

                    {/* Logo Preview on Light Background */}
                    <div className="space-y-3">
                        <p className="text-xs text-muted-foreground">Logo on light background</p>
                        <div className="flex items-center gap-6">
                            <div className="bg-white rounded-lg p-4 border-2">
                                <img
                                    src={appLogo}
                                    alt="Logo Preview"
                                    className="h-12 w-auto max-w-[200px]"
                                    onError={(e) => {
                                        e.currentTarget.src = "/logo.svg";
                                    }}
                                />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium">{appName}</p>
                                <p className="text-xs text-muted-foreground">Alternative view</p>
                            </div>
                        </div>
                    </div>

                    {/* Favicon Preview */}
                    <div className="space-y-3 pt-4 border-t">
                        <p className="text-xs text-muted-foreground">Favicon preview</p>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="border-2 rounded p-2">
                                    <img
                                        src={faviconUrl}
                                        alt="Favicon Preview"
                                        className="h-4 w-4"
                                        onError={(e) => {
                                            e.currentTarget.src = "/favicon.ico";
                                        }}
                                    />
                                </div>
                                <div className="border-2 rounded p-2 bg-slate-100 dark:bg-slate-800">
                                    <img
                                        src={faviconUrl}
                                        alt="Favicon Preview"
                                        className="h-4 w-4"
                                        onError={(e) => {
                                            e.currentTarget.src = "/favicon.ico";
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium">Browser Tab Icon</p>
                                <p className="text-xs text-muted-foreground">Shown at 16x16 pixels</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default BrandingParameters;
