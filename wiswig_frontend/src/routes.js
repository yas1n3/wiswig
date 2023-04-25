import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import NewsletterPage from './pages/NewsletterPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import AddUserForm from './pages/User/AddUserForm';
import ClientPage from './pages/Client/ClientPage';


// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      path: '/',
      element: <LoginPage />,
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/editor" />, index: true },
        {
          path: 'editor',
          element: <DashboardAppPage />,
          children: [{ path: ':id', element: <DashboardAppPage /> }],
        },

        { path: 'user', element: <UserPage /> },
        { path: 'products', element: <ProductsPage /> },
        { path: 'newsletters', element: <NewsletterPage /> },
        { path: 'user/adduser', element: <AddUserForm /> },
        { path: 'user/edit/:id', element: <AddUserForm /> },
        { path: 'client', element: <ClientPage /> },

      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
