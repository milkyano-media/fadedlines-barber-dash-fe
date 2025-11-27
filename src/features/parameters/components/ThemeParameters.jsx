import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sun, Moon, Palette } from "lucide-react";

const ThemeParameters = () => {
    // Light mode colors
    const [lightPrimaryColor, setLightPrimaryColor] = useState("#000000");
    const [lightSecondaryColor, setLightSecondaryColor] = useState("#64748b");
    const [lightAccentColor, setLightAccentColor] = useState("#3b82f6");
    const [lightBackgroundColor, setLightBackgroundColor] = useState("#ffffff");
    const [lightForegroundColor, setLightForegroundColor] = useState("#0a0a0a");

    // Dark mode colors
    const [darkPrimaryColor, setDarkPrimaryColor] = useState("#ffffff");
    const [darkSecondaryColor, setDarkSecondaryColor] = useState("#94a3b8");
    const [darkAccentColor, setDarkAccentColor] = useState("#60a5fa");
    const [darkBackgroundColor, setDarkBackgroundColor] = useState("#0a0a0a");
    const [darkForegroundColor, setDarkForegroundColor] = useState("#fafafa");

    // Apply light mode preset
    const applyLightPreset = (preset) => {
        switch (preset) {
            case "default":
                setLightPrimaryColor("#000000");
                setLightSecondaryColor("#64748b");
                setLightAccentColor("#3b82f6");
                setLightBackgroundColor("#ffffff");
                setLightForegroundColor("#0a0a0a");
                break;
            case "purple":
                setLightPrimaryColor("#7c3aed");
                setLightSecondaryColor("#a78bfa");
                setLightAccentColor("#c084fc");
                setLightBackgroundColor("#faf5ff");
                setLightForegroundColor("#1e1b4b");
                break;
            case "emerald":
                setLightPrimaryColor("#059669");
                setLightSecondaryColor("#10b981");
                setLightAccentColor("#34d399");
                setLightBackgroundColor("#f0fdf4");
                setLightForegroundColor("#064e3b");
                break;
            case "red":
                setLightPrimaryColor("#dc2626");
                setLightSecondaryColor("#ef4444");
                setLightAccentColor("#f87171");
                setLightBackgroundColor("#fef2f2");
                setLightForegroundColor("#7f1d1d");
                break;
            default:
                break;
        }
    };

    // Apply dark mode preset
    const applyDarkPreset = (preset) => {
        switch (preset) {
            case "default":
                setDarkPrimaryColor("#ffffff");
                setDarkSecondaryColor("#94a3b8");
                setDarkAccentColor("#60a5fa");
                setDarkBackgroundColor("#0a0a0a");
                setDarkForegroundColor("#fafafa");
                break;
            case "purple":
                setDarkPrimaryColor("#c084fc");
                setDarkSecondaryColor("#a78bfa");
                setDarkAccentColor("#e9d5ff");
                setDarkBackgroundColor("#1e1b4b");
                setDarkForegroundColor("#f5f3ff");
                break;
            case "emerald":
                setDarkPrimaryColor("#34d399");
                setDarkSecondaryColor("#10b981");
                setDarkAccentColor("#6ee7b7");
                setDarkBackgroundColor("#064e3b");
                setDarkForegroundColor("#f0fdf4");
                break;
            case "red":
                setDarkPrimaryColor("#f87171");
                setDarkSecondaryColor("#ef4444");
                setDarkAccentColor("#fca5a5");
                setDarkBackgroundColor("#7f1d1d");
                setDarkForegroundColor("#fef2f2");
                break;
            default:
                break;
        }
    };

    // Color input component for reusability
    const ColorInput = ({ label, value, onChange, description }) => (
        <div className="space-y-3">
            <label className="text-sm font-medium">{label}</label>
            <div className="flex items-center gap-3">
                <input
                    type="color"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-10 w-20 rounded-md border cursor-pointer"
                />
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={value}
                    className="flex-1"
                />
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </div>
    );

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Palette className="h-5 w-5" />
                        <CardTitle>Theme Customization</CardTitle>
                    </div>
                    <CardDescription>Configure separate color schemes for light mode and dark mode</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="light" className="space-y-6">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="light" className="flex items-center gap-2">
                                <Sun className="h-4 w-4" />
                                Light Mode
                            </TabsTrigger>
                            <TabsTrigger value="dark" className="flex items-center gap-2">
                                <Moon className="h-4 w-4" />
                                Dark Mode
                            </TabsTrigger>
                        </TabsList>

                        {/* Light Mode Tab */}
                        <TabsContent value="light" className="space-y-6">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Light Mode Colors</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ColorInput
                                            label="Primary Color"
                                            value={lightPrimaryColor}
                                            onChange={setLightPrimaryColor}
                                            description="Main brand color for light mode"
                                        />
                                        <ColorInput
                                            label="Secondary Color"
                                            value={lightSecondaryColor}
                                            onChange={setLightSecondaryColor}
                                            description="Supporting color for UI elements"
                                        />
                                        <ColorInput
                                            label="Accent Color"
                                            value={lightAccentColor}
                                            onChange={setLightAccentColor}
                                            description="Highlight color for interactive elements"
                                        />
                                        <ColorInput
                                            label="Background Color"
                                            value={lightBackgroundColor}
                                            onChange={setLightBackgroundColor}
                                            description="Main background color"
                                        />
                                        <ColorInput
                                            label="Foreground Color"
                                            value={lightForegroundColor}
                                            onChange={setLightForegroundColor}
                                            description="Main text color"
                                        />
                                    </div>
                                </div>

                                {/* Light Mode Preview */}
                                <div
                                    className="border rounded-lg p-6 space-y-4"
                                    style={{ backgroundColor: lightBackgroundColor }}
                                >
                                    <h4 className="text-sm font-medium mb-4" style={{ color: lightForegroundColor }}>
                                        Light Mode Preview
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                        <div className="flex flex-col items-center gap-2">
                                            <div
                                                className="h-16 w-16 rounded-md border-2"
                                                style={{ backgroundColor: lightPrimaryColor }}
                                            />
                                            <span className="text-xs" style={{ color: lightForegroundColor }}>
                                                Primary
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <div
                                                className="h-16 w-16 rounded-md border-2"
                                                style={{ backgroundColor: lightSecondaryColor }}
                                            />
                                            <span className="text-xs" style={{ color: lightForegroundColor }}>
                                                Secondary
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <div
                                                className="h-16 w-16 rounded-md border-2"
                                                style={{ backgroundColor: lightAccentColor }}
                                            />
                                            <span className="text-xs" style={{ color: lightForegroundColor }}>
                                                Accent
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <div
                                                className="h-16 w-16 rounded-md border-2"
                                                style={{
                                                    backgroundColor: lightBackgroundColor,
                                                    borderColor: lightForegroundColor,
                                                }}
                                            />
                                            <span className="text-xs" style={{ color: lightForegroundColor }}>
                                                Background
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <div
                                                className="h-16 w-16 rounded-md border-2"
                                                style={{ backgroundColor: lightForegroundColor }}
                                            />
                                            <span className="text-xs" style={{ color: lightForegroundColor }}>
                                                Foreground
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Light Mode Presets */}
                                <div>
                                    <h4 className="text-sm font-medium mb-3">Quick Presets</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <Button
                                            variant="outline"
                                            className="h-auto py-3 flex-col gap-2"
                                            onClick={() => applyLightPreset("default")}
                                        >
                                            <div className="flex gap-1">
                                                <div className="h-5 w-5 rounded bg-black" />
                                                <div className="h-5 w-5 rounded bg-slate-500" />
                                                <div className="h-5 w-5 rounded bg-blue-500" />
                                            </div>
                                            <span className="text-xs">Default</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-auto py-3 flex-col gap-2"
                                            onClick={() => applyLightPreset("purple")}
                                        >
                                            <div className="flex gap-1">
                                                <div className="h-5 w-5 rounded bg-violet-600" />
                                                <div className="h-5 w-5 rounded bg-violet-400" />
                                                <div className="h-5 w-5 rounded bg-violet-300" />
                                            </div>
                                            <span className="text-xs">Purple</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-auto py-3 flex-col gap-2"
                                            onClick={() => applyLightPreset("emerald")}
                                        >
                                            <div className="flex gap-1">
                                                <div className="h-5 w-5 rounded bg-emerald-600" />
                                                <div className="h-5 w-5 rounded bg-emerald-500" />
                                                <div className="h-5 w-5 rounded bg-emerald-400" />
                                            </div>
                                            <span className="text-xs">Emerald</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-auto py-3 flex-col gap-2"
                                            onClick={() => applyLightPreset("red")}
                                        >
                                            <div className="flex gap-1">
                                                <div className="h-5 w-5 rounded bg-red-600" />
                                                <div className="h-5 w-5 rounded bg-red-500" />
                                                <div className="h-5 w-5 rounded bg-red-400" />
                                            </div>
                                            <span className="text-xs">Red</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        {/* Dark Mode Tab */}
                        <TabsContent value="dark" className="space-y-6">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Dark Mode Colors</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <ColorInput
                                            label="Primary Color"
                                            value={darkPrimaryColor}
                                            onChange={setDarkPrimaryColor}
                                            description="Main brand color for dark mode"
                                        />
                                        <ColorInput
                                            label="Secondary Color"
                                            value={darkSecondaryColor}
                                            onChange={setDarkSecondaryColor}
                                            description="Supporting color for UI elements"
                                        />
                                        <ColorInput
                                            label="Accent Color"
                                            value={darkAccentColor}
                                            onChange={setDarkAccentColor}
                                            description="Highlight color for interactive elements"
                                        />
                                        <ColorInput
                                            label="Background Color"
                                            value={darkBackgroundColor}
                                            onChange={setDarkBackgroundColor}
                                            description="Main background color"
                                        />
                                        <ColorInput
                                            label="Foreground Color"
                                            value={darkForegroundColor}
                                            onChange={setDarkForegroundColor}
                                            description="Main text color"
                                        />
                                    </div>
                                </div>

                                {/* Dark Mode Preview */}
                                <div
                                    className="border rounded-lg p-6 space-y-4"
                                    style={{ backgroundColor: darkBackgroundColor }}
                                >
                                    <h4 className="text-sm font-medium mb-4" style={{ color: darkForegroundColor }}>
                                        Dark Mode Preview
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                        <div className="flex flex-col items-center gap-2">
                                            <div
                                                className="h-16 w-16 rounded-md border-2"
                                                style={{ backgroundColor: darkPrimaryColor }}
                                            />
                                            <span className="text-xs" style={{ color: darkForegroundColor }}>
                                                Primary
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <div
                                                className="h-16 w-16 rounded-md border-2"
                                                style={{ backgroundColor: darkSecondaryColor }}
                                            />
                                            <span className="text-xs" style={{ color: darkForegroundColor }}>
                                                Secondary
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <div
                                                className="h-16 w-16 rounded-md border-2"
                                                style={{ backgroundColor: darkAccentColor }}
                                            />
                                            <span className="text-xs" style={{ color: darkForegroundColor }}>
                                                Accent
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <div
                                                className="h-16 w-16 rounded-md border-2"
                                                style={{
                                                    backgroundColor: darkBackgroundColor,
                                                    borderColor: darkForegroundColor,
                                                }}
                                            />
                                            <span className="text-xs" style={{ color: darkForegroundColor }}>
                                                Background
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center gap-2">
                                            <div
                                                className="h-16 w-16 rounded-md border-2"
                                                style={{ backgroundColor: darkForegroundColor }}
                                            />
                                            <span className="text-xs" style={{ color: darkForegroundColor }}>
                                                Foreground
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Dark Mode Presets */}
                                <div>
                                    <h4 className="text-sm font-medium mb-3">Quick Presets</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        <Button
                                            variant="outline"
                                            className="h-auto py-3 flex-col gap-2"
                                            onClick={() => applyDarkPreset("default")}
                                        >
                                            <div className="flex gap-1">
                                                <div className="h-5 w-5 rounded bg-white" />
                                                <div className="h-5 w-5 rounded bg-slate-400" />
                                                <div className="h-5 w-5 rounded bg-blue-400" />
                                            </div>
                                            <span className="text-xs">Default</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-auto py-3 flex-col gap-2"
                                            onClick={() => applyDarkPreset("purple")}
                                        >
                                            <div className="flex gap-1">
                                                <div className="h-5 w-5 rounded bg-violet-400" />
                                                <div className="h-5 w-5 rounded bg-violet-300" />
                                                <div className="h-5 w-5 rounded bg-violet-200" />
                                            </div>
                                            <span className="text-xs">Purple</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-auto py-3 flex-col gap-2"
                                            onClick={() => applyDarkPreset("emerald")}
                                        >
                                            <div className="flex gap-1">
                                                <div className="h-5 w-5 rounded bg-emerald-400" />
                                                <div className="h-5 w-5 rounded bg-emerald-300" />
                                                <div className="h-5 w-5 rounded bg-emerald-200" />
                                            </div>
                                            <span className="text-xs">Emerald</span>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-auto py-3 flex-col gap-2"
                                            onClick={() => applyDarkPreset("red")}
                                        >
                                            <div className="flex gap-1">
                                                <div className="h-5 w-5 rounded bg-red-400" />
                                                <div className="h-5 w-5 rounded bg-red-300" />
                                                <div className="h-5 w-5 rounded bg-red-200" />
                                            </div>
                                            <span className="text-xs">Red</span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default ThemeParameters;
