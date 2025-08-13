import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { setGlobalLogout } from './api';

const AuthContext = createContext();

// Utility function to decode JWT token
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;
  
  // Check if token expires in the next 5 minutes (300 seconds)
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

// Check if token will expire soon (within 10 minutes)
const isTokenExpiringSoon = (token) => {
  if (!token) return false;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return false;
  
  const currentTime = Math.floor(Date.now() / 1000);
  const tenMinutes = 10 * 60; // 10 minutes in seconds
  return decoded.exp < (currentTime + tenMinutes);
};

// Get token expiration time
const getTokenExpirationTime = (token) => {
  if (!token) return null;
  
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return null;
  
  return new Date(decoded.exp * 1000);
};

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    const name = localStorage.getItem("name");
    
    // Check if token exists and is not expired
    if (token && role && !isTokenExpired(token)) {
      return { token, role, id: userId, name };
    }
    
    // If token is expired, clear storage
    if (token && isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("userId");
      localStorage.removeItem("name");
    }
    
    return null;
  });

  const [sessionWarning, setSessionWarning] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  // Set loading to false after initialization
  useEffect(() => {
    setLoading(false);
  }, []);

  // Auto-logout function
  const autoLogout = useCallback((reason = 'Session expired') => {
    console.log(`Auto-logout: ${reason}`);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    setUser(null);
    setSessionWarning(false);
    setSessionExpired(false);
    
    // Use window.location for navigation if navigate is not available
    try {
      if (navigate) {
        navigate('/login', { 
          state: { 
            message: reason === 'Session expired' 
              ? 'Your session has expired. Please log in again.' 
              : 'You have been logged out due to inactivity.' 
          } 
        });
      } else {
        // Fallback to window.location
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location
      window.location.href = '/login';
    }
  }, [navigate]);

  // Set global logout function for API utility
  useEffect(() => {
    setGlobalLogout(autoLogout);
  }, [autoLogout]);

  // Check token expiration periodically
  useEffect(() => {
    if (!user?.token) return;

    const checkTokenExpiration = () => {
      if (isTokenExpired(user.token)) {
        autoLogout('Session expired');
        return;
      }

      if (isTokenExpiringSoon(user.token)) {
        setSessionWarning(true);
      } else {
        setSessionWarning(false);
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Check every minute
    const interval = setInterval(checkTokenExpiration, 60000);

    return () => clearInterval(interval);
  }, [user?.token, autoLogout]);

  // Session timeout warning
  useEffect(() => {
    if (!sessionWarning || !user) return;

    const timeout = setTimeout(() => {
      setSessionExpired(true);
      autoLogout('Session timeout');
    }, 5 * 60 * 1000); // 5 minutes after warning

    return () => clearTimeout(timeout);
  }, [sessionWarning, user, autoLogout]);

  // Health check function to test backend connectivity
  const checkBackendHealth = async () => {
    try {
      const response = await fetch('/api/auth/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Backend health check status:', response.status);
      return response.ok;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  };

  // Login function that handles API call
  const login = async (email, password, role) => {
    try {
      console.log('Attempting login with:', { email, role });
      
      // Check backend connectivity first
      const isBackendHealthy = await checkBackendHealth();
      if (!isBackendHealthy) {
        throw new Error('Backend server is not accessible. Please check if the server is running.');
      }
      
      // Make API call to login endpoint
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role }),
      });

      console.log('Login response status:', response.status);
      console.log('Login response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: `HTTP ${response.status}: ${response.statusText}` 
        }));
        console.error('Login error response:', errorData);
        throw new Error(errorData.error || errorData.message || `Login failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Login success data:', { 
        hasToken: !!data.token, 
        role: data.role, 
        userId: data.userId, 
        name: data.name 
      });
      
      // Validate response data
      if (!data.token) {
        console.error('No token in response:', data);
        throw new Error('Invalid response: No token received from server');
      }

      // Validate token before storing
      if (isTokenExpired(data.token)) {
        console.error('Token is expired:', data.token);
        throw new Error('Invalid or expired token received from server');
      }

      console.log('Token validation passed, storing user data');

      // Store in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("name", data.name);

      // Update state
      setUser({ 
        token: data.token, 
        role: data.role, 
        id: data.userId, 
        name: data.name 
      });
      setSessionWarning(false);
      setSessionExpired(false);

      console.log('User logged in successfully, navigating to dashboard');
      console.log('Navigation target:', `/${data.role.toLowerCase()}`);
      console.log('Navigate function available:', !!navigate);

      // Navigate to appropriate dashboard based on role
      try {
        if (navigate) {
          console.log('Using navigate function');
          navigate(`/${data.role.toLowerCase()}`);
        } else {
          console.log('Using window.location.href');
          window.location.href = `/${data.role.toLowerCase()}`;
        }
      } catch (error) {
        console.error('Navigation error:', error);
        console.log('Falling back to window.location.href');
        window.location.href = `/${data.role.toLowerCase()}`;
      }

    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = (reason = 'User logged out') => {
    console.log(`Logout: ${reason}`);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
    setUser(null);
    setSessionWarning(false);
    setSessionExpired(false);
    
    // Navigate to login
    try {
      if (navigate) {
        navigate('/login');
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = '/login';
    }
  };

  const refreshSession = () => {
    setSessionWarning(false);
    setSessionExpired(false);
  };

  const getTokenInfo = () => {
    if (!user?.token) return null;

    const decoded = decodeToken(user.token);
    if (!decoded) return null;

    return {
      userId: decoded.userId || decoded.sub,
      role: decoded.role,
      exp: decoded.exp,
      iat: decoded.iat,
      expirationTime: getTokenExpirationTime(user.token),
      isExpired: isTokenExpired(user.token),
      isExpiringSoon: isTokenExpiringSoon(user.token)
    };
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user?.token,
    login,
    logout,
    refreshSession,
    getTokenInfo,
    sessionWarning,
    sessionExpired,
    autoLogout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function getToken() {
  return localStorage.getItem("token");
}

// Export utility functions for use in other files
export { decodeToken, isTokenExpired, isTokenExpiringSoon, getTokenExpirationTime };