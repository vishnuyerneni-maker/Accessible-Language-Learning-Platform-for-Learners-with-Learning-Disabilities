import React from 'react';
import { Navigate } from 'react-router-dom';
// cleaned up MockBackend reference

const ProtectedRoute = ({ children, requiredRole }) => {
    // Read from the new key 'user' set by api.js
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        // Not logged in
        return <Navigate to="/" replace />;
    }

    if (requiredRole && user.role !== requiredRole) {
        // Redirection based on role
        if (user.role === 'admin') return <Navigate to="/admin" replace />;
        if (user.role === 'parent') return <Navigate to="/guardian-dashboard" replace />;
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
