import React from "react";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

const isAuthenticated = () => {
  // Check if the user is authenticated
  const authToken = Cookies.get("auth_token");
  return !!authToken; // Return true if the user is authenticated, false otherwise
};

const PrivateRoute = ({ children }) => {
  const isAuthenticatedUser = isAuthenticated();

  return isAuthenticatedUser ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
