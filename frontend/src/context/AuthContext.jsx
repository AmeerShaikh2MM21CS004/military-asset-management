import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, role: null, username: null });

  const login = ({ token, role, username }) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("username", username);
    setAuth({ token, role, username });
  };

  const logout = () => {
    localStorage.clear();
    setAuth({ token: null, role: null, username: null });
  };

  // load from localStorage on refresh
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const username = localStorage.getItem("username");
    if (token && role) setAuth({ token, role, username });
  }, []);

  return <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
