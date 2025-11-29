import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sun, Moon, Palette } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateThemeColor, applyThemePreset } from "../store/parametersSlice";
import { selectTheme } from "../store/selectors";

// Color input component for reusability - defined outside to prevent re-creation
const ColorInput = React.memo(({ label, value, onChange, description }) => (
    <div className="space-y-3">
        <label className="text-sm font-medium">{label}</label>
        <div className="flex items-center gap-3">
            <input
                type="color"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-10 w-20 rounded-md border cursor-pointer"
            />
            <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={value} className="flex-1" />
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
    </div>
));

ColorInput.displayName = "ColorInput";

const ThemeParameters = () => {
    const dispatch = useAppDispatch();
    const theme = useAppSelector(selectTheme);

    // Destructure theme colors for easier access
    const {
        light: {
            primary: lightPrimaryColor,
            secondary: lightSecondaryColor,
            accent: lightAccentColor,
            background: lightBackgroundColor,
            foreground: lightForegroundColor,
        },
        dark: {
            primary: darkPrimaryColor,
            secondary: darkSecondaryColor,
            accent: darkAccentColor,
            background: darkBackgroundColor,
            foreground: darkForegroundColor,
        },
    } = theme;

    // Preset color schemes
    const presets = {
        light: {
            default: {
                primary: "#000000",
                secondary: "#64748b",
                accent: "#3b82f6",
                background: "#ffffff",
                foreground: "#0a0a0a",
            },
            purple: {
                primary: "#7c3aed",
                secondary: "#a78bfa",
                accent: "#c084fc",
                background: "#faf5ff",
                foreground: "#1e1b4b",
            },
            emerald: {
                primary: "#059669",
                secondary: "#10b981",
                accent: "#34d399",
                background: "#f0fdf4",
                foreground: "#064e3b",
            },
            red: {
                primary: "#dc2626",
                secondary: "#ef4444",
                accent: "#f87171",
                background: "#fef2f2",
                foreground: "#7f1d1d",
            },
        },
        dark: {
            default: {
                primary: "#ffffff",
                secondary: "#94a3b8",
                accent: "#60a5fa",
                background: "#0a0a0a",
                foreground: "#fafafa",
            },
            purple: {
                primary: "#c084fc",
                secondary: "#a78bfa",
                accent: "#e9d5ff",
                background: "#1e1b4b",
                foreground: "#f5f3ff",
            },
            emerald: {
                primary: "#34d399",
                secondary: "#10b981",
                accent: "#6ee7b7",
                background: "#064e3b",
                foreground: "#f0fdf4",
            },
            red: {
                primary: "#f87171",
                secondary: "#ef4444",
                accent: "#fca5a5",
                background: "#7f1d1d",
                foreground: "#fef2f2",
            },
        },
    };

    // Apply light mode preset
    const applyLightPresetHandler = (presetName) => {
        if (presets.light[presetName]) {
            dispatch(applyThemePreset({ mode: "light", preset: presets.light[presetName] }));
        }
    };

    // Apply dark mode preset
    const applyDarkPresetHandler = (presetName) => {
        if (presets.dark[presetName]) {
            dispatch(applyThemePreset({ mode: "dark", preset: presets.dark[presetName] }));
        }
    };

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
                                            onChange={(value) =>
                                                dispatch(
                                                    updateThemeColor({ mode: "light", colorKey: "primary", value }),
                                                )
                                            }
                                            description="Main brand color for light mode"
                                        />
                                        <ColorInput
                                            label="Secondary Color"
                                            value={lightSecondaryColor}
                                            onChange={(value) =>
                                                dispatch(
                                                    updateThemeColor({ mode: "light", colorKey: "secondary", value }),
                                                )
                                            }
                                            description="Supporting color for UI elements"
                                        />
                                        <ColorInput
                                            label="Accent Color"
                                            value={lightAccentColor}
                                            onChange={(value) =>
                                                dispatch(updateThemeColor({ mode: "light", colorKey: "accent", value }))
                                            }
                                            description="Highlight color for interactive elements"
                                        />
                                        <ColorInput
                                            label="Background Color"
                                            value={lightBackgroundColor}
                                            onChange={(value) =>
                                                dispatch(
                                                    updateThemeColor({ mode: "light", colorKey: "background", value }),
                                                )
                                            }
                                            description="Main background color"
                                        />
                                        <ColorInput
                                            label="Foreground Color"
                                            value={lightForegroundColor}
                                            onChange={(value) =>
                                                dispatch(
                                                    updateThemeColor({ mode: "light", colorKey: "foreground", value }),
                                                )
                                            }
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
                                            onClick={() => applyLightPresetHandler("default")}
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
                                            onClick={() => applyLightPresetHandler("purple")}
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
                                            onClick={() => applyLightPresetHandler("emerald")}
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
                                            onClick={() => applyLightPresetHandler("red")}
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
                                            onChange={(value) =>
                                                dispatch(updateThemeColor({ mode: "dark", colorKey: "primary", value }))
                                            }
                                            description="Main brand color for dark mode"
                                        />
                                        <ColorInput
                                            label="Secondary Color"
                                            value={darkSecondaryColor}
                                            onChange={(value) =>
                                                dispatch(
                                                    updateThemeColor({ mode: "dark", colorKey: "secondary", value }),
                                                )
                                            }
                                            description="Supporting color for UI elements"
                                        />
                                        <ColorInput
                                            label="Accent Color"
                                            value={darkAccentColor}
                                            onChange={(value) =>
                                                dispatch(updateThemeColor({ mode: "dark", colorKey: "accent", value }))
                                            }
                                            description="Highlight color for interactive elements"
                                        />
                                        <ColorInput
                                            label="Background Color"
                                            value={darkBackgroundColor}
                                            onChange={(value) =>
                                                dispatch(
                                                    updateThemeColor({ mode: "dark", colorKey: "background", value }),
                                                )
                                            }
                                            description="Main background color"
                                        />
                                        <ColorInput
                                            label="Foreground Color"
                                            value={darkForegroundColor}
                                            onChange={(value) =>
                                                dispatch(
                                                    updateThemeColor({ mode: "dark", colorKey: "foreground", value }),
                                                )
                                            }
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
                                            onClick={() => applyDarkPresetHandler("default")}
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
                                            onClick={() => applyDarkPresetHandler("purple")}
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
                                            onClick={() => applyDarkPresetHandler("emerald")}
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
                                            onClick={() => applyDarkPresetHandler("red")}
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
