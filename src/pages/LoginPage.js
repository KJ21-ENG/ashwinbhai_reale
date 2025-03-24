import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Paper, 
  Divider, 
  IconButton, 
  InputAdornment,
  Link as MuiLink,
  Fade,
  Alert,
  Checkbox,
  FormControlLabel,
  useTheme,
  alpha,
  Grid,
  CircularProgress
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import { useIsMobile } from '../utils/deviceDetect';

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Handle login form submission
  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    // Simple validation
    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password');
      return;
    }
    
    // Email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setFormSubmitted(true);
      
      // Redirect to home page after successful login
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }, 1500);
  };
  
  // Handle social login
  const handleSocialLogin = (provider) => {
    setLoading(true);
    
    // Simulate API call for social login
    setTimeout(() => {
      setLoading(false);
      setFormSubmitted(true);
      
      // Redirect to home page after successful login
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }, 1500);
  };
  
  // Toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        py: 8,
        position: 'relative',
        bgcolor: alpha(theme.palette.primary.main, 0.03)
      }}
    >
      {/* Background decoration */}
      <Box 
        sx={{ 
          position: 'absolute',
          top: 0,
          right: 0,
          width: { xs: '150px', md: '300px' },
          height: { xs: '150px', md: '300px' },
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.4)} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
          borderBottomLeftRadius: '100%',
          zIndex: 0
        }}
      />
      
      <Box 
        sx={{ 
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: { xs: '150px', md: '300px' },
          height: { xs: '150px', md: '300px' },
          background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.4)} 100%)`,
          borderTopRightRadius: '100%',
          zIndex: 0
        }}
      />
      
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in={true} timeout={800}>
          <Paper 
            elevation={isMobile ? 3 : 6} 
            sx={{ 
              p: { xs: 3, md: 5 },
              borderRadius: 4,
              backdropFilter: 'blur(10px)',
              background: 'rgba(255, 255, 255, 0.9)',
              boxShadow: isMobile ? 
                '0 8px 16px rgba(0,0,0,0.1)' : 
                '0 16px 32px rgba(0,0,0,0.1), 0 4px 8px rgba(0,0,0,0.05)'
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography 
                variant={isMobile ? "h5" : "h4"} 
                component="h1" 
                fontWeight="bold"
                color="primary"
                gutterBottom
              >
                Welcome Back
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Sign in to continue to your account
              </Typography>
            </Box>
            
            {formSubmitted ? (
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3, 
                  alignItems: 'center',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
              >
                Login successful! Redirecting you to the dashboard...
              </Alert>
            ) : error ? (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            ) : null}
            
            <form onSubmit={handleLogin}>
              <TextField
                label="Email Address"
                type="email"
                fullWidth
                margin="normal"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || formSubmitted}
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />
              
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                margin="normal"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading || formSubmitted}
                InputProps={{
                  sx: { borderRadius: 2 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePassword}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1, mb: 3 }}>
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={rememberMe} 
                      onChange={(e) => setRememberMe(e.target.checked)} 
                      color="primary"
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">Remember me</Typography>}
                />
                
                <MuiLink 
                  component={Link} 
                  to="/forgot-password" 
                  variant="body2" 
                  color="primary"
                  sx={{ textDecoration: 'none', fontWeight: 'medium' }}
                >
                  Forgot Password?
                </MuiLink>
              </Box>
              
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading || formSubmitted}
                sx={{ 
                  py: 1.2, 
                  borderRadius: 8,
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
                  },
                  fontWeight: 'bold'
                }}
                startIcon={loading ? null : <LoginIcon />}
              >
                {loading ? <CircularProgress size={24} /> : 'Sign In'}
              </Button>
            </form>
            
            <Box sx={{ mt: 3, mb: 3 }}>
              <Divider>
                <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                  Or continue with
                </Typography>
              </Divider>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<GoogleIcon />}
                  onClick={() => handleSocialLogin('google')}
                  disabled={loading || formSubmitted}
                  sx={{ 
                    borderColor: '#DB4437',
                    color: '#DB4437',
                    '&:hover': {
                      borderColor: '#DB4437',
                      backgroundColor: alpha('#DB4437', 0.05),
                    },
                    borderRadius: 8,
                    py: 1
                  }}
                >
                  Google
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<FacebookIcon />}
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={loading || formSubmitted}
                  sx={{ 
                    borderColor: '#4267B2',
                    color: '#4267B2',
                    '&:hover': {
                      borderColor: '#4267B2',
                      backgroundColor: alpha('#4267B2', 0.05),
                    },
                    borderRadius: 8,
                    py: 1
                  }}
                >
                  Facebook
                </Button>
              </Grid>
            </Grid>
            
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <MuiLink 
                  component={Link} 
                  to="/register" 
                  color="primary"
                  sx={{ textDecoration: 'none', fontWeight: 'bold' }}
                >
                  Sign Up
                </MuiLink>
              </Typography>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default LoginPage; 