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

    const register = async (userData) => {
        try {
            setLoading(true);
            const response = await authService.register(userData);
            setUser(response.user);
            return response;
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    // Check authentication state on mount
    useEffect(() => {
        const initializeAuth = () => {
            const token = authService.getToken();
            const userData = authService.getCurrentUser();

            console.log("Initializing auth:", { token: !!token, userData: !!userData });

            if (token && userData) {
                setUser(userData);
            } else {
                // Clear any invalid data
                authService.logout();
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
        isAuthenticated: !!user && !!authService.getToken(),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
