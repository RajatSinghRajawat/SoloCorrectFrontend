import React from 'react';
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        alert("Please login");
        return <Navigate to="/login" />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
