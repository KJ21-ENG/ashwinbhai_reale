import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, CircularProgress, Box } from '@mui/material';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import ListingsPage from './pages/ListingsPage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import ContactPage from './pages/ContactPage';
import FavoritesPage from './pages/FavoritesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import Footer from './components/Footer';
import MobileBottomNav from './components/MobileBottomNav';
import { useIsMobile } from './utils/deviceDetect';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32', // Green color for real estate feel
      light: '#60ad5e',
      dark: '#005005',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#ff6d00', // Orange for calls-to-action
      light: '#ff9e40',
      dark: '#c43e00',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f9f9f9',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        },
      },
    },
  },
});

function App() {
  const [loading, setLoading] = useState(true);
  
  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);
  
  // AppContent component to conditionally render header/footer based on mobile
  const AppContent = () => {
    const isMobile = useIsMobile();

    if (loading) {
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          flexDirection: 'column',
          gap: 2,
          bgcolor: theme.palette.primary.main
        }}>
          <CircularProgress size={60} sx={{ color: 'white' }} />
          <Box 
            component="img" 
            src="/images/logo.png" 
            alt="Logo" 
            sx={{ 
              width: 200,
              height: 'auto',
              filter: 'brightness(0) invert(1)'
            }} 
          />
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {!isMobile && <Header />}
        <Box component="main" sx={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/property/:id" element={<PropertyDetailsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </Box>
        {!isMobile && <Footer />}
        {isMobile && <MobileBottomNav />}
      </Box>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
