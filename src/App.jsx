import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import { AuthProvider } from './features/auth/contexts/AuthProvider';
import { ThemeProvider } from './shared/components/providers/ThemeProvider';
import ProtectedRoute from './shared/routes/ProtectedRoute';
import PublicRoute from './shared/routes/PublicRoute';
import DashboardLayout from './shared/components/DashboardLayout';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import DashboardHomePage from './features/dashboard-home/DashboardHomePage';
import NotFoundPage from './features/not-found/NotFoundPage';
import CustomersPage from './features/customers/CustomersPage';
import CampaignsPage from './features/campaigns/CampaignsPage';
import ConversionsPage from './features/conversions/ConversionsPage';

// Route configuration array
const routesConfig = [
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />
      },
      {
        path: 'dashboard',
        element: <DashboardHomePage />
      },
      {
        path: 'customers',
        element: <CustomersPage />
      },
      {
        path: 'campaigns',
        element: <CampaignsPage />
      },
      {
        path: 'conversions',
        element: <ConversionsPage />
      }
    ]
  },
  {
    path: '/login',
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    )
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    )
  },
  {
    path: '*',
    element: <NotFoundPage />
  }
];

// Create the router from the routes configuration
const router = createBrowserRouter(routesConfig);

const App = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
