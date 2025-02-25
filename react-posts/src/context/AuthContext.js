import React, { createContext, useState, useEffect } from "react";
import { isAuthenticated, logout } from "../services/authService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(isAuthenticated());

  useEffect(() => {
    const checkAuth = () => {
      setIsAuth(isAuthenticated());
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    logout();
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, setIsAuth, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
