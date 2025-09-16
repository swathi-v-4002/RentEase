import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { token } = useContext(AuthContext);

  // If there's a token, render the child component. Otherwise, redirect to login.
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
