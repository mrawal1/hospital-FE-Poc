// src/app/router/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { tokenService } from '@shared/services/token-service';

export const ProtectedRoute: React.FC = () => {
    if (!tokenService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};
