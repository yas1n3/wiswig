import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector, Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PersistGate } from 'redux-persist/integration/react';
import { SnackbarProvider } from 'notistack';
import io from 'socket.io-client';
import { store, persistor } from './store/store';
import { AuthProvider } from './context/AuthContext';

// Routes
import Router from './routes';

// Theme
import ThemeProvider from './theme';

// Components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';

const socket = io('ws://localhost:4000');

function App() {
  const dispatch = useDispatch();
  const loggedInUser = useSelector((state) => state.user);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    // Handle online status updates received from the WebSocket server
    socket.on('onlineStatus', (data) => {
      const { userId, isOnline } = data;

      // Update online status in the UI
      setOnlineUsers((prevOnlineUsers) => {
        const updatedUsers = prevOnlineUsers.map((user) =>
          user._id === userId ? { ...user, isOnline } : user
        );
        return updatedUsers;
      });
    });

    // Emit the logged-in user's information to the WebSocket server
    if (loggedInUser && loggedInUser.user) {
      console.log('Emitting login message for user:', loggedInUser.user._id);

      socket.emit('login', loggedInUser.user._id);
    }

    return () => {
      // Clean up the WebSocket connection
      socket.disconnect();
    };
  }, [loggedInUser]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <HelmetProvider>
            <BrowserRouter>
              <ThemeProvider>
                <SnackbarProvider>
                  <ScrollToTop />
                  <StyledChart />
                  <Router />
                </SnackbarProvider>
              </ThemeProvider>
            </BrowserRouter>
          </HelmetProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
