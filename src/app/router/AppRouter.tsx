import { lazy } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './RootLayout';

const SignupPage = lazy(() => import('@modules/auth/pages/SignupPage'));
const LoginPage = lazy(() => import('@modules/auth/pages/LoginPage'));


const DashboardLayout = lazy(() => import('@modules/dashboard/pages/index.tsx'));
const DashboardPage = lazy(() => import('@modules/dashboard/pages/DashboardPage'));
const DoctorListPage = lazy(() => import('@modules/dashboard/pages/DoctorListPage'));
const CreateDoctorPage = lazy(() => import('@modules/dashboard/pages/CreateDoctorPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />, // Main layout for nested routes
    children: [
      { index: true, element: <LoginPage /> }, // Default route
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      {
        path: '',
        element: <DashboardLayout />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'doctors', element: <DoctorListPage /> },
          { path: 'create-doctor', element: <CreateDoctorPage /> },
        ],
      },
      // Add more child routes here
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
