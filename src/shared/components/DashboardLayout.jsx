import React from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../features/auth/hooks/useAuth';
import Navigation from './Navigation';
import { 
  Home, 
  Users, 
  BarChart3, 
  LineChart 
} from 'lucide-react';
import { cn } from '@/lib/twUtils';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: Home },
  { path: '/customers', label: 'Customers', icon: Users },
  { path: '/campaigns', label: 'Campaigns', icon: BarChart3 },
  { path: '/conversions', label: 'Conversions', icon: LineChart }
];

const DashboardLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  return (
    <div className='relative flex min-h-screen flex-col overflow-hidden'>
      <Navigation />
      
      <div className='lg:flex lg:flex-row w-full'>
        {/* Desktop Sidebar */}
        <div className='hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:w-64 lg:border-r lg:bg-background lg:pt-16'>
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
        </div>

        {/* Main content area */}
        <main className='flex-1 lg:pl-64 pt-16'>
          <div className='p-6'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
