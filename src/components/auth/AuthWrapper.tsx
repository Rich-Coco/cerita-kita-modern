
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ 
  children, 
  requireAuth = false 
}) => {
  const { user, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authentication is required and user is not logged in
  if (requireAuth && !user) {
    return <Navigate to="/auth" />;
  }

  // If user is already logged in and tries to access login/signup page
  if (!requireAuth && user) {
    return <Navigate to="/profile" />;
  }

  return <>{children}</>;
};

export default AuthWrapper;
