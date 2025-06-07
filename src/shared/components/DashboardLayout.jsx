import React from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../features/auth/hooks/useAuth';
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
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/twUtils';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/customers', label: 'Customers', icon: TrendingUp },
  { path: '/barbers', label: 'Barbers', icon: Users },
  { path: '/campaigns', label: 'Campaigns', icon: BarChart3 },
  { path: '/conversions', label: 'Conversions', icon: LineChart },
  { path: '/events', label: 'Events', icon: ActivitySquare },
  { path: '/sync-etl', label: 'Sync & ETL', icon: Database }
];

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <div className='relative flex min-h-screen flex-col overflow-hidden'>
      <div className='lg:flex lg:flex-row w-full'>
        {/* Desktop Sidebar */}
        <div className='hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-52 lg:border-r lg:bg-background'>
          {/* User info and theme toggle at top */}
          <div className='p-4 border-b'>
            <div className='flex items-center justify-between mb-2'>
              <h2 className='font-bold text-lg'>FadedLine</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="h-8 w-8"
              >
                <Sun className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
            <p className='text-sm text-muted-foreground'>Hi, {user?.name}</p>
          </div>
          
          {/* Navigation */}
          <div className='flex-1 overflow-y-auto py-4'>
            <nav className='flex flex-col px-2 space-y-1'>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-md group',
                      location.pathname === item.path
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted'
                    )}
                  >
                    <Icon className='mr-3 h-5 w-5' />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* Logout button at bottom */}
          <div className='p-4 border-t'>
            <Button
              variant='ghost'
              className='w-full flex items-center justify-start text-muted-foreground hover:text-foreground'
              onClick={logout}
            >
              <LogOut className='mr-3 h-5 w-5' />
              Logout
            </Button>
          </div>
        </div>

        {/* Main content area */}
        <main className='flex-1 lg:pl-52'>
          <div className='p-6'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
