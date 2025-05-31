import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../features/auth/hooks/useAuth';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  console.log('PublicRoute:', { isAuthenticated, loading, user: !!user, path: location.pathname });

  if (loading) {
    return <div className='p-6'>Loading...</div>;
  }

  // If user is logged in, redirect them to the dashboard
  if (isAuthenticated) {
    const from = location.state?.from?.pathname || '/dashboard';
    console.log('User is authenticated, redirecting to:', from);
    return <Navigate to={from} replace />;
  }

  return children;
};

export default PublicRoute;
