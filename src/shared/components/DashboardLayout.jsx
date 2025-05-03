import React from 'react';
import { Link, Outlet } from 'react-router';
import { useAuth } from '../../features/auth/hooks/useAuth';
import Navigation from './Navigation';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/customers', label: 'Customers' },
  { path: '/campaigns', label: 'Campaigns' },
  { path: '/conversions', label: 'Conversions' }
];

const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className='min-h-screen bg-gray-100'>
      <Navigation />
      <div className='container mx-auto py-6'>
        <div className='flex'>
          {/* Sidebar */}
          <div className='w-64 bg-white rounded shadow p-4 mr-6'>
            <div className='mb-6'>
              <h2 className='text-xl font-bold'>Barber Dashboard</h2>
              <p className='text-sm text-gray-500'>Welcome, {user?.name}</p>
            </div>

            <nav>
              <ul className='space-y-2'>
                {menuItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className='block py-2 px-4 rounded hover:bg-muted'
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Main content area */}
          <div className='flex-1 bg-white rounded shadow p-6'>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
