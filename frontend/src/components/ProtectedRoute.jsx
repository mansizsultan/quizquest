import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    alert("Login terlebih dahulu!");
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;
