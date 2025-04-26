"use client";

import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token, loading, isAuthenticated } = useContext(AuthContext);

  console.log(user, token);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log("fone");
    // Redirect to appropriate dashboard based on role
    if (user.role === "candidate") {
      return <Navigate to="/candidate/dashboard" />;
    } else if (user.role === "admin") {
      return <Navigate to="/admin/dashboard" />;
    } else if (user.role === "manager") {
      return <Navigate to="/manager/dashboard" />;
    } else if (user.role === "jury") {
      return <Navigate to="/jury/dashboard" />;
    } else {
      return <Navigate to="/" />;
    }
  }
  return <Outlet />;
};

export default ProtectedRoute;
