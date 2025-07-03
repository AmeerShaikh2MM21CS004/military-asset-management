import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const role = localStorage.getItem("userRole");

  if (!role) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    return <div className="p-4 text-red-600">Access Denied</div>;
  }

  return children;
};

export default ProtectedRoute;
