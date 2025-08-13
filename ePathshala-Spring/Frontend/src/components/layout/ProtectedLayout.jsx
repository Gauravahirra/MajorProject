import React from 'react';
import { Box } from '@mui/material';
import { useAuth } from '../../utils/auth';
import { Navigate } from 'react-router-dom';

const ProtectedLayout = ({ children, allowedRoles = [], requiredRole }) => {
  const { user, isAuthenticated } = useAuth();

  console.log('ProtectedLayout - user:', user);
  console.log('ProtectedLayout - isAuthenticated:', isAuthenticated);
  console.log('ProtectedLayout - requiredRole:', requiredRole);
  console.log('ProtectedLayout - allowedRoles:', allowedRoles);

  if (!isAuthenticated) {
    console.log('ProtectedLayout - Redirecting to login (not authenticated)');
    return <Navigate to="/login" replace />;
  }

  // Check if specific role is required
  if (requiredRole && user?.role !== requiredRole) {
    console.log('ProtectedLayout - Redirecting to unauthorized (role mismatch)');
    console.log('Required role:', requiredRole, 'User role:', user?.role);
    return <Navigate to="/unauthorized" replace />;
  }

  // Check if any of the allowed roles match
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    console.log('ProtectedLayout - Redirecting to unauthorized (not in allowed roles)');
    return <Navigate to="/unauthorized" replace />;
  }

  console.log('ProtectedLayout - Rendering children');

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {children}
    </Box>
  );
};

export default ProtectedLayout;

