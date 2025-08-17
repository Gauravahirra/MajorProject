import React, { createContext, useState } from 'react';

/**
 * Provides a global authentication context for the app.  Tracks the
 * current JWT, user role and name, and exposes login/logout functions.
 * Components can subscribe to this context to reactively update when
 * authentication state changes, avoiding manual page reloads.
 */
export const AuthContext = createContext({
  token: null,
  role: null,
  name: null,
  login: () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole] = useState(() => localStorage.getItem('role'));
  const [name, setName] = useState(() => localStorage.getItem('name'));

  const login = (newToken, newRole, newName) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    localStorage.setItem('name', newName);
    setToken(newToken);
    setRole(newRole);
    setName(newName);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    setToken(null);
    setRole(null);
    setName(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, name, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
