import { Navigate, useRoutes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
import NewsletterPage from './pages/NewsletterPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import AddUserForm from './pages/User/AddUserForm';
import ClientPage from './pages/Client/ClientPage';
import AddClientForm from './pages/Client/AddClientForm';

export default function Router() {
  const user = useSelector((state) => state.user);
  const [isLoggedIn, setIsLoggedIn] = useState(user.isLoggedIn);
  const isAdmin = user?.user?.role === 'Admin';

  useEffect(() => {
    setIsLoggedIn(user.isLoggedIn);
  }, [user.isLoggedIn]);

  const routes = useRoutes([
    {
      path: '/',
      element: isLoggedIn ? <Navigate to="/dashboard/newsletters" /> : <LoginPage />,
    },
    {
      path: '/dashboard',
      element: isLoggedIn ? <DashboardLayout /> : <Navigate to="/" />,
      children: [
        { element: <Navigate to="/dashboard/editor" />, index: true },
        {
          path: 'editor',
          element: isLoggedIn ? <DashboardAppPage /> : <Navigate to="/" />,
          children: [{ path: ':id', element: <DashboardAppPage /> }],
        },
        { path: 'newsletters', element: isLoggedIn ? <NewsletterPage /> : <Navigate to="/" /> },
        { path: 'user', element: isAdmin ? <UserPage /> : <Navigate to="/" /> },
        { path: 'user/add', element: isAdmin ? <AddUserForm /> : <Navigate to="/" /> },
        { path: 'user/edit/:id', element: isAdmin ? <AddUserForm /> : <Navigate to="/" /> },
        { path: 'settings', element: isLoggedIn ? <AddUserForm /> : <Navigate to="/" /> },

        { path: 'client', element: isLoggedIn ? <ClientPage /> : <Navigate to="/" /> },
        { path: 'client/add', element: isLoggedIn ? <AddClientForm /> : <Navigate to="/" /> },
        { path: 'client/edit/:id', element: isLoggedIn ? <AddClientForm /> : <Navigate to="/" /> },
      ],
    },
    {
      path: '*',
      element: (
          <Page404 />
      ),
    },
  ]);

  return routes;
}
