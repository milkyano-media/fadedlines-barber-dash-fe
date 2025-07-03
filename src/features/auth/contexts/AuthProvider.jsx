import React, { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { authService } from "../services/authService";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = (userData) => {
    // TODO: Implement register API call
    const newUser = { ...userData, id: Date.now() };
    setUser(newUser);
    localStorage.setItem("user_data", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Helper function to validate token format
  const isValidToken = (token) => {
    if (!token || typeof token !== 'string') return false;
    
    // Check for common invalid values
    if (token === 'undefined' || token === 'null' || token === '') return false;
    
    // Basic JWT structure check (header.payload.signature)
    const parts = token.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
  };

  // Helper function to validate user object
  const isValidUser = (userData) => {
    if (!userData || typeof userData !== 'object') return false;
    
    // Check for required properties
    return userData.id && userData.email && typeof userData.id !== 'undefined';
  };

  // Check authentication state on mount
  useEffect(() => {
    const initializeAuth = () => {
      const token = authService.getToken();
      const userData = authService.getCurrentUser();
      
      console.log('Initializing auth:', { token: !!token, userData: !!userData });
      
      if (isValidToken(token) && isValidUser(userData)) {
        setUser(userData);
      } else {
        // Clear any invalid data
        authService.logout();
        setUser(null);
      }
      
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: isValidUser(user) && isValidToken(authService.getToken()),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
