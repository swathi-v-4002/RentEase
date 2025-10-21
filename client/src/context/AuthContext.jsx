import React, {
  createContext,
  useState,
  useLayoutEffect,
  useContext,
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
  const [pendingCount, setPendingCount] = useState(0); // <-- 1. Your state from before

  // --- 2. Function to fetch the count ---
  // We'll pass the token to it to avoid state timing issues
  const fetchPendingCount = async (currentToken) => {
    if (!currentToken) {
      setPendingCount(0);
      return;
    }
    try {
      const config = {
        headers: { Authorization: `Bearer ${currentToken}` },
      };
      const res = await axios.get("/api/rentals/pending-count", config);
      setPendingCount(res.data.count);
    } catch (error) {
      console.error("Failed to fetch pending count", error);
      setPendingCount(0);
    }
  };

  useLayoutEffect(() => {
    // We wrap the async logic in a function
    const loadAuthData = async () => {
      try {
        if (token) {
          localStorage.setItem("token", token);
          // Set header for all future requests
          axios.defaults.headers.common["x-auth-token"] = token;
          const decodedUser = jwtDecode(token);
          setUser(decodedUser.user);

          // --- 3. Fetch the count on login/refresh ---
          await fetchPendingCount(token);
        } else {
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
          setUser(null);

          // --- 4. Clear count on logout ---
          setPendingCount(0);
        }
      } catch (error) {
        console.error("Auth error:", error);
        localStorage.removeItem("token");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        setPendingCount(0);
      } finally {
        setIsLoadingAuth(false);
      }
    };

    loadAuthData();
  }, [token]);

  const login = (newToken) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        isLoadingAuth,
        pendingCount, // <-- 5. Expose count
        fetchPendingCount, // <-- 6. Expose fetch function
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
