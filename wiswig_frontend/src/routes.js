import { Navigate, Route, useRoutes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/dashboard';
import LoginPage from './pages/LoginPage';
import DashboardAppPage from './pages/DashboardAppPage';
import ProductsPage from './pages/ProductsPage';
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import Page404 from './pages/Page404';
import NewUser from './pages/NewUser';
import New from './pages/User/NewUser';

export default function Router() {
  const { isAuthenticated } = useAuth();

  function PrivateRoute({ element, ...rest }) {
    return isAuthenticated ? (
      <Route {...rest} element={element} />
    ) : (
      <Navigate to="/" replace />
    );
  }

  return useRoutes([
    {
      path: '/',
      element: isAuthenticated ? <Navigate to="/dashboard/app" /> : <LoginPage />,
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <PrivateRoute element={<DashboardAppPage />} /> },
        { path: 'products', element: <PrivateRoute element={<ProductsPage />} /> },
        { path: 'blog', element: <PrivateRoute element={<BlogPage />} /> },
        { path: 'newuser', element: { New } },
        {
          path: 'user',
          element: <PrivateRoute element={<UserPage />} />,
          children: [
            { path: 'new', element: <PrivateRoute element={<NewUser />} /> }
          ]
        }
      ]
    },
    {
      path: '*',
      element: <Page404 />
    }
  ]);
}
