import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../utils/auth';
import { CircularProgress, Box } from '@mui/material';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isTokenExpired } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (user === undefined) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Check if user is authenticated
  if (!user || isTokenExpired()) {
    // Redirect to login with return URL
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location.pathname,
          message: 'Please log in to access this page.'
        }} 
        replace 
      />
    );
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <Navigate 
        to="/login" 
        state={{ 
          message: 'You do not have permission to access this page.'
        }} 
        replace 
      />
    );
  }

  return children;
};

export default ProtectedRoute;
