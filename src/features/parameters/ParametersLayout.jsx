import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { useAuth } from "../auth/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/twUtils";
import { useTheme } from "next-themes";
import {
    Palette,
    Settings,
    Image,
    ToggleLeft,
    Save,
    RotateCcw,
    AlertTriangle,
    LogOut,
    Moon,
    Sun,
    Menu,
    X,
} from "lucide-react";

const ParametersLayout = () => {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Navigation items for left sidebar
    const navItems = [
        { id: "theme", label: "Theme", icon: Palette, path: "/parameters/theme" },
        { id: "branding", label: "Branding", icon: Image, path: "/parameters/branding" },
        { id: "features", label: "Features", icon: ToggleLeft, path: "/parameters/features" },
        { id: "general", label: "General", icon: Settings, path: "/parameters/general" },
    ];

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                mobileMenuOpen &&
                !event.target.closest(".mobile-sidebar") &&
                !event.target.closest(".mobile-menu-button")
            ) {
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [mobileMenuOpen]);

    return (
        <div className="relative flex min-h-screen flex-col">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-[100] w-full flex items-center justify-between p-4 bg-background backdrop-blur-md shadow-lg border-b">
                <div className="flex items-center space-x-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="mobile-menu-button"
                    >
                        {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </Button>
                    <div className="bg-black rounded-lg p-1">
                        <img src="/logo.svg" alt="Fadedlines Logo" className="h-8 w-auto" />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
                        <Sun className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Mobile Sidebar */}
            <div
                className={cn(
                    "mobile-sidebar lg:hidden fixed inset-y-0 left-0 z-[120] w-64 bg-background shadow-2xl transform transition-transform duration-200 ease-in-out",
                    mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                <div className="flex flex-col h-full">
                    {/* User info */}
                    <div className="p-4 border-b">
                        <div className="flex items-center justify-between mb-2">
                            <div className="bg-black rounded-lg p-1">
                                <img src="/logo.svg" alt="Fadedlines Logo" className="h-10 w-auto" />
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">Hi, {user?.name}</p>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex-1 overflow-y-auto py-4">
                        <div className="px-3 mb-2">
                            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Parameters
                            </h2>
                        </div>
                        <nav className="flex flex-col px-2 space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.id}
                                        to={item.path}
                                        className={cn(
                                            "flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors",
                                            location.pathname === item.path
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:bg-muted",
                                        )}
                                    >
                                        <Icon className="mr-3 h-5 w-5" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Mobile Logout button */}
                    <div className="p-4 border-t">
                        <Button
                            variant="ghost"
                            className="w-full flex items-center justify-start text-muted-foreground hover:text-foreground"
                            onClick={logout}
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Logout
                        </Button>
                    </div>
                </div>
            </div>

            {/* Desktop Left Sidebar */}
            <div className="flex flex-row w-full">
                <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-64 lg:border-r lg:bg-background">
                    {/* Header with Logo and User Info */}
                    <div className="p-4 border-b">
                        <div className="flex items-center justify-between mb-2">
                            <div
                                className="flex-1"
                                style={{
                                    marginLeft: -6,
                                    backgroundColor: "#000000",
                                    borderRadius: 10,
                                    padding: 3,
                                }}
                            >
                                <img src="/logo.svg" alt="Fadedlines Logo" className="h-12 w-auto" />
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                                className="h-10 w-10 flex-shrink-0"
                            >
                                <Sun className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Toggle theme</span>
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">Hi, {user?.name}</p>
                    </div>

                    {/* Navigation */}
                    <div className="flex-1 overflow-y-auto py-4">
                        <div className="px-3 mb-2">
                            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Parameters
                            </h2>
                        </div>
                        <nav className="flex flex-col px-2 space-y-1">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.id}
                                        to={item.path}
                                        className={cn(
                                            "flex items-center px-3 py-2 text-sm font-medium rounded-md group transition-colors",
                                            location.pathname === item.path
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:bg-muted",
                                        )}
                                    >
                                        <Icon className="mr-3 h-5 w-5" />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Logout button at bottom */}
                    <div className="p-4 border-t">
                        <Button
                            variant="ghost"
                            className="w-full flex items-center justify-start text-muted-foreground hover:text-foreground"
                            onClick={logout}
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            Logout
                        </Button>
                    </div>
                </div>

                {/* Main content area */}
                <main className="flex-1 lg:pl-64 pt-[73px] lg:pt-0">
                    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <h1 className="text-3xl font-bold">System Parameters</h1>
                                <p className="text-muted-foreground">
                                    Configure application settings, theme, and feature flags
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="outline" className="flex items-center gap-2">
                                    <RotateCcw className="h-4 w-4" />
                                    Reset to Defaults
                                </Button>
                                <Button className="flex items-center gap-2">
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </Button>
                            </div>
                        </div>

                        {/* Warning Banner */}
                        <Card className="border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20">
                            <CardContent className="flex items-start gap-3 pt-6">
                                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                                        Administrative Access Required
                                    </p>
                                    <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
                                        Changes to these parameters will affect all users. Please review carefully
                                        before saving.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Dynamic Content from Nested Routes */}
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ParametersLayout;
