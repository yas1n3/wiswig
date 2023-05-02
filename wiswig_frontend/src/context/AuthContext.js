import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const dispatch = useDispatch();

  const [user, setUser] = useState(null);

  const login = async (mail, password) => {
    const response = await fetch('http://localhost:4000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mail, password }),
      credentials: 'include', // send cookies with the request
    });

    if (response.ok) {
      const { user } = await response.json();
      setUser(user);

      dispatch({ type: 'LOGIN_SUCCESS', payload: { user } }); // dispatching action to save the user in the Redux store
      return true;
    }

    console.error('Error:', response.status);
    return false;
  };

  const logout = async () => {
    // Remove the user from the Redux store
    dispatch({ type: 'LOGOUT' });

    // Remove the JWT cookie from the server
    try {
      const response = await fetch('http://localhost:4000/auth/logout', {
        method: 'DELETE',
        credentials: 'include', 
      });
      if (response.ok) {
        console.log('JWT cookie removed from the server');
      } else {
        console.error('Failed to remove JWT cookie from the server:', response.status);
      }
    } catch (error) {
      console.error('Failed to remove JWT cookie from the server:', error);
    }

    document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; HttpOnly; SameSite=None';

    setUser(null);
  };




  const value = {
    user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
