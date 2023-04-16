import { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
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
      return true;
    }

    console.error('Error:', response.status);
    return false;
  };



  const logout = () => {
    // Remove the JWT from the browser's cookie storage
    document.cookie = 'jwt=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; secure; HttpOnly; SameSite=None';
    setUser(null);
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop().split(';').shift();
    }
    return null; // or return undefined, depending on your preference
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
