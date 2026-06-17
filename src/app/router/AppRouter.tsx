import { lazy } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import RootLayout from './RootLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicOnlyRoute } from './PublicOnlyRoute';
import { ErrorBoundary } from './ErrorBoundary';

const SignupPage = lazy(() => import('@modules/auth/pages/SignupPage'));
const LoginPage = lazy(() => import('@modules/auth/pages/LoginPage'));


const DashboardLayout = lazy(() => import('@modules/dashboard/pages/index.tsx'));
const DashboardPage = lazy(() => import('@modules/dashboard/pages/DashboardPage'));
const DoctorListPage = lazy(() => import('@modules/dashboard/pages/DoctorListPage'));
const CreateDoctorPage = lazy(() => import('@modules/dashboard/pages/CreateDoctorPage'));
const RegisterPatientPage = lazy(() => import('@modules/patients/pages/RegisterPatientPage'));
const PatientListPage = lazy(() => import('@modules/patients/pages/PatientListPage'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, // Main layout for nested routes
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      {
        path: '',
        element: <PublicOnlyRoute />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'signup', element: <SignupPage /> },
        ],
      },
      {
        path: '',
        element: <ProtectedRoute />,
        children: [
          {
            element: <DashboardLayout />,
            children: [
              { path: 'dashboard', element: <DashboardPage /> },
              { path: 'doctors', element: <DoctorListPage /> },
              { path: 'create-doctor', element: <CreateDoctorPage /> },
              { path: 'patients', element: <PatientListPage /> },
              { path: 'register-patient', element: <RegisterPatientPage /> },
            ]
          }
        ]
      }
      // Add more child routes here
    ],
  },
]);

export default function AppRouter() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
