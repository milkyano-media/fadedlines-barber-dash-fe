import React, { useState } from "react";
import { AuthContext } from "./AuthContext";
import { authService } from "../services/authService";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(false);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
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

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
