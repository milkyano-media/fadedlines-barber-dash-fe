import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { useAuth } from "../auth/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogBody,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
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
    CheckCircle2,
    ArrowRight,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { initializeParameters, saveParameters, saveParametersSuccess, resetSection } from "./store/parametersSlice";
import { selectIsDirty, selectIsSaving, selectParametersDiff } from "./store/selectors";

const ParametersLayout = () => {
    const { user, logout } = useAuth();
    const { theme, setTheme } = useTheme();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showSaveModal, setShowSaveModal] = useState(false);

    // Get state from Redux
    const isDirty = useAppSelector(selectIsDirty);
    const isSaving = useAppSelector(selectIsSaving);
    const parametersDiff = useAppSelector(selectParametersDiff);

    // Navigation items for left sidebar
    const navItems = [
        { id: "theme", label: "Theme", icon: Palette, path: "/parameters/theme" },
        { id: "branding", label: "Branding", icon: Image, path: "/parameters/branding" },
        { id: "features", label: "Features", icon: ToggleLeft, path: "/parameters/features" },
        { id: "general", label: "General", icon: Settings, path: "/parameters/general" },
    ];

    // Initialize parameters on mount
    useEffect(() => {
        dispatch(initializeParameters());
    }, [dispatch]);

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

    // Close modal on ESC key
    useEffect(() => {
        const handleEscapeKey = (event) => {
            if (event.key === "Escape" && showSaveModal) {
                setShowSaveModal(false);
            }
        };

        document.addEventListener("keydown", handleEscapeKey);
        return () => document.removeEventListener("keydown", handleEscapeKey);
    }, [showSaveModal]);

    // Handle save changes
    const handleSaveChanges = () => {
        if (isDirty) {
            setShowSaveModal(true);
        }
    };

    // Confirm and save
    const confirmSave = async () => {
        dispatch(saveParameters());
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        dispatch(saveParametersSuccess());
        setShowSaveModal(false);
        // TODO: Show success notification
    };

    // Get current section from URL
    const getCurrentSection = () => {
        const parts = location.pathname.split("/");
        return parts[parts.length - 1]; // e.g., 'theme', 'branding', 'features', 'general'
    };

    // Handle reset current section
    const handleResetSection = () => {
        const section = getCurrentSection();
        dispatch(resetSection(section));
    };

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
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2"
                                    onClick={handleResetSection}
                                    disabled={!isDirty}
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    Reset Section
                                </Button>
                                <Button
                                    onClick={handleSaveChanges}
                                    className="flex items-center gap-2"
                                    disabled={!isDirty}
                                >
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

            {/* Save Confirmation Modal */}
            <Dialog open={showSaveModal} onOpenChange={setShowSaveModal}>
                <DialogContent onClose={() => setShowSaveModal(false)} className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Confirm Changes</DialogTitle>
                        <DialogDescription>
                            Please review the changes below before saving. These changes will affect all users.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Changes Summary - Scrollable */}
                    <DialogBody>
                        <div className="space-y-4 pb-4">
                            {parametersDiff && (
                                <>
                                    {/* Theme Changes */}
                                    {parametersDiff.theme.length > 0 && (
                                        <div className="border rounded-lg p-4 bg-muted/50">
                                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                                <Palette className="h-4 w-4" />
                                                Theme Changes
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                {parametersDiff.theme.map((change, idx) => (
                                                    <div key={idx} className="flex items-start gap-3">
                                                        <ArrowRight className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                                        <div className="flex-1">
                                                            <span className="font-medium capitalize">
                                                                {change.mode} {change.field}:
                                                            </span>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <div
                                                                    className="h-6 w-6 rounded border"
                                                                    style={{ backgroundColor: change.from }}
                                                                />
                                                                <span className="text-muted-foreground">
                                                                    {change.from}
                                                                </span>
                                                                <span className="text-muted-foreground">→</span>
                                                                <div
                                                                    className="h-6 w-6 rounded border"
                                                                    style={{ backgroundColor: change.to }}
                                                                />
                                                                <span className="text-primary font-medium">
                                                                    {change.to}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Branding Changes */}
                                    {parametersDiff.branding.length > 0 && (
                                        <div className="border rounded-lg p-4 bg-muted/50">
                                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                                <Image className="h-4 w-4" />
                                                Branding Changes
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                {parametersDiff.branding.map((change, idx) => (
                                                    <div key={idx} className="flex items-start gap-3">
                                                        <ArrowRight className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                                        <div className="flex-1">
                                                            <span className="font-medium capitalize">
                                                                {change.field.replace(/([A-Z])/g, " $1")}:
                                                            </span>
                                                            <div className="mt-1">
                                                                <span className="text-muted-foreground">
                                                                    {change.from || "None"}
                                                                </span>
                                                                <span className="text-muted-foreground mx-2">→</span>
                                                                <span className="text-primary font-medium">
                                                                    {change.to || "None"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Feature Flag Changes */}
                                    {parametersDiff.features.length > 0 && (
                                        <div className="border rounded-lg p-4 bg-muted/50">
                                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                                <ToggleLeft className="h-4 w-4" />
                                                Feature Flags
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                {parametersDiff.features.map((change, idx) => (
                                                    <div key={idx} className="flex items-start gap-3">
                                                        <ArrowRight className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                                        <div className="flex-1">
                                                            <span className="font-medium capitalize">
                                                                {change.field.replace(/([A-Z])/g, " $1")}:
                                                            </span>
                                                            <div className="mt-1">
                                                                <span className="text-muted-foreground">
                                                                    {change.from ? "Enabled" : "Disabled"}
                                                                </span>
                                                                <span className="text-muted-foreground mx-2">→</span>
                                                                <span
                                                                    className={`font-medium ${change.to ? "text-primary" : "text-muted-foreground"}`}
                                                                >
                                                                    {change.to ? "Enabled" : "Disabled"}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* General Settings Changes */}
                                    {parametersDiff.general.length > 0 && (
                                        <div className="border rounded-lg p-4 bg-muted/50">
                                            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                                <Settings className="h-4 w-4" />
                                                General Settings
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                {parametersDiff.general.map((change, idx) => (
                                                    <div key={idx} className="flex items-start gap-3">
                                                        <ArrowRight className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                                        <div className="flex-1">
                                                            <span className="font-medium capitalize">
                                                                {change.field.replace(/([A-Z])/g, " $1")}:
                                                            </span>
                                                            <div className="mt-1">
                                                                <span className="text-muted-foreground">
                                                                    {change.from}
                                                                </span>
                                                                <span className="text-muted-foreground mx-2">→</span>
                                                                <span className="text-primary font-medium">
                                                                    {change.to}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Info Banner */}
                            <div className="border rounded-lg p-3 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-blue-800 dark:text-blue-200">
                                        All changes will be applied immediately after confirmation. Users may need to
                                        refresh their browsers to see the updates.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </DialogBody>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowSaveModal(false)} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button onClick={confirmSave} disabled={isSaving}>
                            {isSaving ? (
                                <>
                                    <span className="animate-spin mr-2">⏳</span>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Confirm & Save
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ParametersLayout;
