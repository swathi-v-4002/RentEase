// In /src/context/AuthContext.jsx

import React, { 
  createContext, 
  useState, 
  useLayoutEffect, // <-- 1. Import useLayoutEffect
  useContext 
} from "react"; 
import axios from "axios";
import { jwtDecode } from "jwt-decode"; 

export const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(null); 
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // 2. Change this from 'useEffect' to 'useLayoutEffect'
  useLayoutEffect(() => {
    try {
      if (token) {
        localStorage.setItem("token", token);
        axios.defaults.headers.common["x-auth-token"] = token;
        const decodedUser = jwtDecode(token); 
        setUser(decodedUser.user); 
      } else {
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["x-auth-token"];
        setUser(null); 
      }
    } catch (error) {
      console.error("Auth error:", error);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["x-auth-token"];
      setUser(null);
    } finally {
      // 3. This will now run *after* the headers are set,
      // but *before* the browser paints.
      setIsLoadingAuth(false);
    }
  }, [token]); // The dependency is still correct

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
