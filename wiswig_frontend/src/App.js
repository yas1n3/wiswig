import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import { store, persistor } from './store/store';
import { AuthProvider } from './context/AuthContext';

// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <HelmetProvider>
            <BrowserRouter>
              <ThemeProvider>
                <ScrollToTop />
                <StyledChart />
                <Router />
              </ThemeProvider>
            </BrowserRouter>
          </HelmetProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
}
