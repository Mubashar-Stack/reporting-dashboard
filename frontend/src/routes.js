import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import CustomerDashboard from './layouts/customerDashboard';

//

import User from './pages/User';
import Login from './pages/Login';
import NotFound from './pages/Page404';
import Register from './pages/Register';

import DashboardApp from './pages/DashboardApp';
import UploadReports from './pages/uploadReports';

import Domains from './pages/domains';
import UsersDomains from './pages/users_domains';


// ----------------------------------------------------------------------

export default function Router() {
  
  const isLoggedIn  = window.localStorage.getItem('type');

  return useRoutes([
    {
      path: '/dashboard',
      element: isLoggedIn ==='admin' ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <User /> },
        { path: 'uploadReports', element: <UploadReports /> },
        { path: 'domains', element: <Domains /> },
        { path: 'usersDomains', element: <UsersDomains /> },
      ],
    },
    {
      path: '/customerDashboard',
      element: isLoggedIn ==='user' ? <CustomerDashboard /> : <Navigate to="/login" />,
      children: [
        { path: 'app', element: <DashboardApp /> },
      ],
    },
    {
      path: 'login',
      element: <Login />,
    },
    {
      path: 'register',
      element: <Register />,
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: isLoggedIn ==='admin' ? <Navigate to="/dashboard/app" />  : <Navigate to="/customerDashboard/app" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}
