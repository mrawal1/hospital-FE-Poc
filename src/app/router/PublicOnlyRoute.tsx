import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { tokenService } from '@shared/services/token-service';

/**
 * Redirects already-authenticated users away from public-only pages
 * (login, signup) directly to the dashboard.
 */
export const PublicOnlyRoute: React.FC = () => {
  if (tokenService.isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
};
