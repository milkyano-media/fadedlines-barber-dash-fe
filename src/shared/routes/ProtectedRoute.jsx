import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../../features/auth/hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute:', { isAuthenticated, loading, user: !!user, path: location.pathname });

  if (loading) {
    return <div className='p-6'>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    // Redirect to login but save the current location
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
