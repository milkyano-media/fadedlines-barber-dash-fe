import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { useAuth } from "../../features/auth/hooks/useAuth";
import {
  Home,
  Users,
  BarChart3,
  LineChart,
  ActivitySquare,
  Database,
  LogOut,
  Moon,
  Sun,
  TrendingUp,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/twUtils";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: Home },
  { path: "/customers", label: "Customers", icon: TrendingUp },
  { path: "/barbers", label: "Barbers", icon: Users },
  { path: "/campaigns", label: "Campaigns", icon: BarChart3 },
  { path: "/conversions", label: "Conversions", icon: LineChart },
  { path: "/events", label: "Events", icon: ActivitySquare },
  { path: "/sync-etl", label: "Sync & ETL", icon: Database }
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.mobile-sidebar') && !event.target.closest('.mobile-menu-button')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileMenuOpen]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b bg-background">
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
            <img
              src="/logo.svg"
              alt="Fadedlines Logo"
              className="h-8 w-auto"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div className={cn(
        "mobile-sidebar lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Mobile Sidebar Content */}
        <div className="flex flex-col h-full">
          {/* User info */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-black rounded-lg p-1">
                <img
                  src="/logo.svg"
                  alt="Fadedlines Logo"
                  className="h-10 w-auto"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Hi, {user?.name}</p>
          </div>

          {/* Mobile Navigation */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="flex flex-col px-2 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md group",
                      location.pathname === item.path
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted"
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

      <div className="lg:flex lg:flex-row w-full">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-52 lg:border-r lg:bg-background">
          {/* User info and theme toggle at top */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <div
                className="flex-1"
                style={{
                  marginLeft: -6,
                  backgroundColor: "#000000",
                  borderRadius: 10,
                  padding: 3
                }}
              >
                <img
                  src="/logo.svg"
                  alt="Fadedlines Logo"
                  className="h-12 w-auto"
                />
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
            <nav className="flex flex-col px-2 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md group",
                      location.pathname === item.path
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted"
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
        <main className="flex-1 lg:pl-52 pt-0">
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
