import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null); // Add user state

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["x-auth-token"] = token;
      const decodedUser = jwtDecode(token); // Decode the token
      setUser(decodedUser.user); // Set the user state
    } else {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["x-auth-token"];
      setUser(null); // Clear user state on logout
    }
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    // Add user to the context value
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
