import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RoleBasedRoute from './RoleBasedRoute';

const PrivateRoute = ({ children, organizerOnly, adminOnly }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Handle role-based access
  if (organizerOnly) {
    return <RoleBasedRoute allowedRoles={['organizer', 'admin']}>{children}</RoleBasedRoute>;
  }

  if (adminOnly) {
    return <RoleBasedRoute allowedRoles={['admin']}>{children}</RoleBasedRoute>;
  }

  // If no specific role is required, just check authentication
  return children;
};

export default PrivateRoute; 
