import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  // Load user from localStorage and check JWT expiration
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser?.token) {
      try {
        const decoded = jwtDecode(storedUser.token);
        const now = Date.now() / 1000;
        if (decoded.exp > now) {
          setUser(storedUser);
        } else {
          localStorage.removeItem("user");
        }
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // Auto-logout on token expiry
  useEffect(() => {
    if (user?.token) {
      const decoded = jwtDecode(user.token);
      const expiry = decoded.exp * 1000;
      const now = Date.now();
      const timeout = expiry - now;
      if (timeout > 0) {
        const logoutTimer = setTimeout(() => {
          logout();
          alert("Session expired. Please log in again.");
        }, timeout);
        return () => clearTimeout(logoutTimer);
      } else {
        logout();
      }
    }
  }, [user]);

  // Attach token to all axios requests
  useEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser?.token) {
        config.headers.Authorization = `Bearer ${storedUser.token}`;
      }
      return config;
    });
    return () => axios.interceptors.request.eject(interceptor);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    setUser,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
