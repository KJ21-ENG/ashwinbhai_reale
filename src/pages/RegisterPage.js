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
  Stepper,
  Step,
  StepLabel,
  useTheme,
  alpha,
  Grid,
  CircularProgress,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useIsMobile } from '../utils/deviceDetect';

const RegisterPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const [activeStep, setActiveStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  
  // Form errors
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: ''
  });
  
  // Steps for registration process
  const steps = ['Personal Info', 'Account Setup', 'Complete'];
  
  // Handle form input change
  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'acceptTerms' ? checked : value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Validate step 1 (Personal Info)
  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[- ]/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    
    setErrors({ ...errors, ...newErrors });
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate step 2 (Account Setup)
  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    setErrors({ ...errors, ...newErrors });
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle next step
  const handleNext = () => {
    if (activeStep === 0) {
      if (validateStep1()) {
        setActiveStep(1);
      }
    } else if (activeStep === 1) {
      if (validateStep2()) {
        setLoading(true);
        // Simulate API call for registration
        setTimeout(() => {
          setLoading(false);
          setActiveStep(2);
          setFormSubmitted(true);
        }, 1500);
      }
    }
  };
  
  // Handle back step
  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    handleNext();
  };
  
  // Toggle password visibility
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  
  // Redirect to home after successful registration
  const handleGoToLogin = () => {
    navigate('/login');
  };
  
  // Handle social registration
  const handleSocialRegister = (provider) => {
    setLoading(true);
    
    // Simulate API call for social registration
    setTimeout(() => {
      setLoading(false);
      setFormSubmitted(true);
      setActiveStep(2);
    }, 1500);
  };
  
  // Render form steps
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  name="firstName"
                  fullWidth
                  value={formData.firstName}
                  onChange={handleChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  disabled={loading}
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  fullWidth
                  value={formData.lastName}
                  onChange={handleChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  disabled={loading}
                  InputProps={{
                    sx: { borderRadius: 2 }
                  }}
                />
              </Grid>
            </Grid>
            
            <TextField
              label="Email Address"
              name="email"
              type="email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              disabled={loading}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            
            <TextField
              label="Phone Number"
              name="phone"
              fullWidth
              margin="normal"
              value={formData.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              disabled={loading}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForwardIcon />}
                sx={{ 
                  borderRadius: 8,
                  px: 3,
                  py: 1,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 15px rgba(0,0,0,0.12)',
                  }
                }}
              >
                Next
              </Button>
            </Box>
          </Box>
        );
      case 1:
        return (
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
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
            
            <TextField
              label="Confirm Password"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              disabled={loading}
              InputProps={{
                sx: { borderRadius: 2 }
              }}
            />
            
            <Box sx={{ mt: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox 
                    name="acceptTerms" 
                    checked={formData.acceptTerms} 
                    onChange={handleChange} 
                    color="primary"
                  />
                }
                label="I agree to the terms and conditions"
              />
              {errors.acceptTerms && (
                <Typography variant="caption" color="error" sx={{ display: 'block', mt: -1, ml: 2 }}>
                  {errors.acceptTerms}
                </Typography>
              )}
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                onClick={handleBack}
                sx={{ 
                  borderRadius: 8,
                  px: 3,
                  py: 1
                }}
                startIcon={<ArrowBackIcon />}
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ 
                  borderRadius: 8,
                  px: 3,
                  py: 1,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 15px rgba(0,0,0,0.12)',
                  }
                }}
                endIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAddAltIcon />}
              >
                Register
              </Button>
            </Box>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <CheckCircleIcon color="success" sx={{ fontSize: 72, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Registration Successful!
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Thank you for registering with Ashwin Real Estate.
              You can now sign in to access your account.
            </Typography>
            <Button
              variant="contained"
              onClick={handleGoToLogin}
              sx={{ 
                borderRadius: 8,
                px: 4,
                py: 1.2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 15px rgba(0,0,0,0.12)',
                }
              }}
            >
              Go to Login
            </Button>
          </Box>
        );
      default:
        return 'Unknown step';
    }
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
                Create Account
              </Typography>
              {activeStep < 2 && (
                <Typography variant="body1" color="text.secondary">
                  Join our community to find your dream property
                </Typography>
              )}
            </Box>
            
            {activeStep < 2 && (
              <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{!isMobile && label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            )}
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2
                }}
                onClose={() => setError('')}
              >
                {error}
              </Alert>
            )}
            
            {getStepContent(activeStep)}
            
            {activeStep === 0 && (
              <>
                <Box sx={{ mt: 3, mb: 3 }}>
                  <Divider>
                    <Typography variant="body2" color="text.secondary" sx={{ px: 1 }}>
                      Or register with
                    </Typography>
                  </Divider>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<GoogleIcon />}
                      onClick={() => handleSocialRegister('google')}
                      disabled={loading}
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
                      onClick={() => handleSocialRegister('facebook')}
                      disabled={loading}
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
              </>
            )}
            
            {activeStep < 2 && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <MuiLink 
                    component={Link} 
                    to="/login" 
                    color="primary"
                    sx={{ textDecoration: 'none', fontWeight: 'bold' }}
                  >
                    Sign In
                  </MuiLink>
                </Typography>
              </Box>
            )}
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default RegisterPage; 