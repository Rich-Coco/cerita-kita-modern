
// Just render children without any protection
import React from 'react';
interface AuthWrapperProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}
const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => <>{children}</>;
export default AuthWrapper;
