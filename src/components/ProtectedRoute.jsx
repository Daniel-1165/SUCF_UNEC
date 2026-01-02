
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="h-screen flex items-center justify-center bg-gray-50 text-emerald-900 font-bold">Loading...</div>;
    }

    // If not authenticated, redirect to login
    return user ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
