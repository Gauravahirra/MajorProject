// API utility functions for authenticated requests
import { getToken, isTokenExpired } from './auth';

// Global logout function - will be set by the auth context
let globalLogout = null;

// Set the global logout function (called from AuthProvider)
export const setGlobalLogout = (logoutFunction) => {
  globalLogout = logoutFunction;
};

export const apiCall = async (url, options = {}) => {
  const token = getToken();
  
  // Check if token is expired before making the request
  if (token && isTokenExpired(token)) {
    if (globalLogout) {
      globalLogout('Token expired');
    }
    throw new Error('Session expired. Please log in again.');
  }
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };
  
  try {
    const response = await fetch(url, config);
    
    // Handle authentication errors globally
    if (response.status === 401 || response.status === 403) {
      console.log(`Authentication error (${response.status}): ${url}`);
      
      // Clear any expired token
      if (token) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("name");
      }
      
      // Call global logout if available
      if (globalLogout) {
        globalLogout('Authentication failed');
      }
      
      throw new Error('Authentication failed. Please log in again.');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: `HTTP ${response.status}: ${response.statusText}` 
      }));
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    // Re-throw authentication errors
    if (error.message.includes('Authentication failed') || error.message.includes('Session expired')) {
      throw error;
    }
    
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error. Please check your connection.');
    }
    
    // Re-throw other errors
    throw error;
  }
};

// Enhanced API functions with better error handling
export const get = (url) => apiCall(url);

export const post = (url, data) => apiCall(url, { 
  method: 'POST', 
  body: JSON.stringify(data) 
});

export const put = (url, data) => apiCall(url, { 
  method: 'PUT', 
  body: JSON.stringify(data) 
});

export const del = (url) => apiCall(url, { 
  method: 'DELETE' 
});

// File upload helper
export const uploadFile = async (url, formData) => {
  const token = getToken();
  
  if (token && isTokenExpired(token)) {
    if (globalLogout) {
      globalLogout('Token expired');
    }
    throw new Error('Session expired. Please log in again.');
  }
  
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });
    
    if (response.status === 401 || response.status === 403) {
      if (globalLogout) {
        globalLogout('Authentication failed');
      }
      throw new Error('Authentication failed. Please log in again.');
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ 
        error: `HTTP ${response.status}: ${response.statusText}` 
      }));
      throw new Error(errorData.error || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    if (error.message.includes('Authentication failed') || error.message.includes('Session expired')) {
      throw error;
    }
    throw new Error('Upload failed. Please try again.');
  }
};

// Health check function to test authentication
export const checkAuthStatus = async () => {
  try {
    const response = await fetch('/api/auth/status', {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    
    if (response.status === 401 || response.status === 403) {
      return { isAuthenticated: false, reason: 'token_invalid' };
    }
    
    if (response.ok) {
      return { isAuthenticated: true };
    }
    
    return { isAuthenticated: false, reason: 'unknown' };
  } catch (error) {
    return { isAuthenticated: false, reason: 'network_error' };
  }
}; 