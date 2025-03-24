import React, { useEffect, useState, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Fade, 
  Slide, 
  TextField,
  InputAdornment,
  Paper,
  Tabs,
  Tab,
  Avatar,
  Rating,
  Divider,
  Skeleton,
  Stack,
  Chip,
  CircularProgress,
  useTheme,
  alpha
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import properties from '../data/properties.json';
import { useIsMobile } from '../utils/deviceDetect';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import BusinessIcon from '@mui/icons-material/Business';
import ApartmentIcon from '@mui/icons-material/Apartment';
import VillaIcon from '@mui/icons-material/Villa';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import VerifiedIcon from '@mui/icons-material/Verified';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import EmailIcon from '@mui/icons-material/Email';

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const statsRef = useRef(null);
  const [statsInView, setStatsInView] = useState(false);
  const [counters, setCounters] = useState({
    properties: 0,
    clients: 0,
    cities: 0
  });
  
  // Define property categories
  const categories = [
    { id: 'all', label: 'All Properties', icon: <HomeIcon />, color: theme.palette.primary.main },
    { id: 'apartment', label: 'Apartments', icon: <ApartmentIcon />, color: '#9c27b0' },
    { id: 'house', label: 'Houses', icon: <VillaIcon />, color: '#ed6c02' },
    { id: 'commercial', label: 'Commercial', icon: <BusinessIcon />, color: '#0288d1' },
  ];
  
  // Get featured properties based on active tab
  const getFeaturedProperties = () => {
    if (activeTab === 0) return properties.slice(0, isMobile ? 6 : 6);
    const categoryMap = {
      1: 'Apartment',
      2: 'House',
      3: 'Commercial'
    };
    return properties
      .filter(p => p.propertyType.includes(categoryMap[activeTab]))
      .slice(0, isMobile ? 6 : 6);
  };
  
  const featuredProperties = getFeaturedProperties();
  
  // Testimonials data
  const testimonials = [
    {
      name: "Rajesh Patel",
      location: "Ahmedabad",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
      text: "The ease of finding my dream home was incredible. The website's user-friendly interface made my property search enjoyable and stress-free.",
      rating: 5,
    },
    {
      name: "Priya Shah",
      location: "Surat",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
      text: "As a first-time buyer, I was nervous about finding the right property. This platform made it simple with their excellent filtering options and detailed property information.",
      rating: 4,
    },
    {
      name: "Nikhil Mehta",
      location: "Vadodara",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
      text: "I sold my commercial property through this platform and was amazed by the quick response. Their professional service exceeded my expectations.",
      rating: 5,
    }
  ];
  
  // Track scroll position for parallax effect and animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
      
      // Check if stats section is in view
      if (statsRef.current) {
        const rect = statsRef.current.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0 && !statsInView) {
          setStatsInView(true);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Set animation complete after initial render
    const timer = setTimeout(() => {
      setAnimationComplete(true);
      setIsLoading(false);
    }, 500);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [statsInView]);
  
  // Card animation for hero section
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [direction, setDirection] = useState(1); // 1 for forward, -1 for backward
  
  useEffect(() => {
    // Only run the animation when not hovering
    if (!isHovering && animationComplete) {
      const interval = setInterval(() => {
        setActiveCardIndex(prev => {
          const next = (prev + 1) % Math.min(properties.length, 6);
          setDirection(1);
          return next;
        });
      }, 4000);
      
      return () => clearInterval(interval);
    }
  }, [isHovering, animationComplete, properties.length]);
  
  // Function to handle manual slide navigation
  const handleCardNavigation = (index) => {
    setDirection(index > activeCardIndex ? 1 : -1);
    setActiveCardIndex(index);
  };
  
  // Animate counters when stats section is in view
  useEffect(() => {
    if (statsInView) {
      const duration = 2000; // 2 seconds
      const interval = 50; // Update every 50ms
      const steps = duration / interval;
      
      const targetValues = {
        properties: 500,
        clients: 450,
        cities: 10
      };
      
      let step = 0;
      
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        
        setCounters({
          properties: Math.floor(progress * targetValues.properties),
          clients: Math.floor(progress * targetValues.clients),
          cities: Math.floor(progress * targetValues.cities)
        });
        
        if (step >= steps) {
          clearInterval(timer);
        }
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [statsInView]);
  
  // Handle property search
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
      setTimeout(() => {
        navigate(`/listings?search=${encodeURIComponent(searchQuery)}`);
      }, 800);
    }
  };
  
  // Handle tab change for property categories
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle email subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setEmailSubmitted(true);
      // In a real app, you'd send this to your backend
    }
  };

  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1000&auto=format&fit=crop';

  return (
    <Box sx={{ pb: isMobile ? 12 : 0 }}>
      {/* Modern Hero Section with Grid Layout */}
      <Box
        sx={{
          position: 'relative',
          minHeight: isMobile ? '90vh' : '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'background.default',
          pt: isMobile ? 4 : 0
        }}
      >
        {/* Background elements */}
        <Box
          sx={{
            position: 'absolute',
            top: '-10%',
            right: '-5%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.2)}, ${alpha(theme.palette.primary.main, 0.3)})`,
            filter: 'blur(80px)',
            zIndex: 0,
            display: { xs: 'none', md: 'block' }
          }}
        />
        
        <Box
          sx={{
            position: 'absolute',
            bottom: '-15%',
            left: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.light, 0.2)}, ${alpha(theme.palette.secondary.main, 0.3)})`,
            filter: 'blur(80px)',
            zIndex: 0,
            display: { xs: 'none', md: 'block' }
          }}
        />
        
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={3} alignItems="center">
            {/* Left Content */}
            <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 }, mt: { xs: 4, md: 0 } }}>
              <Fade in={true} timeout={1000}>
                <Box>
                  <Typography 
                    variant={isMobile ? "h3" : "h2"} 
                    component="h1" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 800,
                      mb: 3,
                      fontSize: isMobile ? '2.5rem' : '3.8rem',
                      background: `linear-gradient(120deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 1.2
                    }}
                  >
                    Find Your Perfect Place to Call Home
                  </Typography>
                </Box>
              </Fade>
              
              <Fade in={true} timeout={1500} style={{ transitionDelay: '300ms' }}>
                <Typography 
                  variant="h6"
                  gutterBottom 
                  sx={{ 
                    mb: 4, 
                    color: 'text.secondary',
                    maxWidth: '550px',
                    lineHeight: 1.6,
                    fontSize: isMobile ? '1rem' : '1.1rem'
                  }}
                >
                  Explore our exclusive collection of premium properties in Gujarat. 
                  Your journey to finding the perfect home starts here.
                </Typography>
              </Fade>
              
              {/* Property Search Box - Redesigned */}
              <Fade in={true} timeout={2000} style={{ transitionDelay: '600ms' }}>
                <Paper 
                  component="form" 
                  onSubmit={handleSearch}
                  elevation={4}
                  sx={{ 
                    p: 0.8, 
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: 3,
                    mb: 5,
                    maxWidth: '550px',
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    backgroundColor: 'white',
                    boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.15)}`
                  }}
                >
                  <TextField
                    fullWidth
                    placeholder="Enter location, property type or keyword..."
                    variant="standard"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      disableUnderline: true,
                      startAdornment: (
                        <InputAdornment position="start" sx={{ pl: 1 }}>
                          <SearchIcon color="primary" fontSize="medium" />
                        </InputAdornment>
                      ),
                      sx: { p: 1.5 }
                    }}
                  />
                  <Button 
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSearching}
                    sx={{ 
                      borderRadius: 2, 
                      px: 3, 
                      py: 1.5,
                      minWidth: '130px',
                      textTransform: 'none',
                      fontSize: '1.05rem',
                      fontWeight: 'bold',
                      boxShadow: 'none'
                    }}
                  >
                    {isSearching ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      'Search'
                    )}
                  </Button>
                </Paper>
              </Fade>
              
              {/* Property Category Tags */}
              <Fade in={true} timeout={2500} style={{ transitionDelay: '900ms' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                    Popular categories:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                    {categories.map((category, index) => (
                      <Chip
                        key={category.id}
                        icon={category.icon}
                        label={category.label}
                        onClick={() => setActiveTab(index)}
                        sx={{
                          bgcolor: activeTab === index ? category.color : 'white',
                          color: activeTab === index ? 'white' : 'text.primary',
                          border: `1px solid ${alpha(category.color, activeTab === index ? 1 : 0.3)}`,
                          '&:hover': {
                            bgcolor: activeTab === index ? category.color : alpha(category.color, 0.1),
                          },
                          px: 0.5,
                          height: 36,
                          '& .MuiChip-label': {
                            px: 1,
                            fontWeight: 500
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Fade>
            </Grid>
            
            {/* Right Content - Property Cards Preview */}
            <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }}>
              <Box 
                sx={{ 
                  position: 'relative', 
                  height: isMobile ? '360px' : '500px',
                  perspective: '1500px',
                  transformStyle: 'preserve-3d'
                }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {/* 3D Book/Card Stack Animation */}
                <Box sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transformStyle: 'preserve-3d'
                }}>
                  {properties.slice(0, 6).map((property, index) => {
                    // Calculate if this card is before or after the active card
                    const isBeforeActive = index < activeCardIndex;
                    const isAfterActive = index > activeCardIndex;
                    const distance = Math.abs(index - activeCardIndex);
                    
                    // Define animation properties
                    const isActive = index === activeCardIndex;
                    const zIndex = 6 - distance;
                    const opacity = isActive ? 1 : Math.max(0.85 - (distance * 0.1), 0.6);
                    
                    // Card position and rotation 
                    let xTranslate = 0;
                    let yTranslate = 0;
                    let zTranslate = 0;
                    let rotateY = 0;
                    let scale = 1;
                    
                    if (isBeforeActive) {
                      // Cards before active slide to left and back
                      xTranslate = `-${20 + (distance * 10)}%`;
                      zTranslate = `-${distance * 50}px`;
                      rotateY = `-${distance * 8}deg`;
                      scale = Math.max(0.85 - (distance * 0.05), 0.7);
                    } else if (isAfterActive) {
                      // Cards after active slide to right and back
                      xTranslate = `${20 + (distance * 10)}%`;
                      zTranslate = `-${distance * 50}px`; 
                      rotateY = `${distance * 8}deg`;
                      scale = Math.max(0.85 - (distance * 0.05), 0.7);
                    } else {
                      // Active card in center
                      xTranslate = '0%';
                      yTranslate = '0%';
                      zTranslate = '0px';
                      rotateY = '0deg';
                      scale = 1;
                    }
                    
                    // Always get the first image from the array, with fallback
                    const backgroundImage = property.images && property.images.length > 0 
                      ? property.images[0] 
                      : "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80";

                    return (
                      <Box
                        key={property.id}
                        component={Link}
                        to={`/property/${property.id}`}
                        onClick={(e) => {
                          if (index !== activeCardIndex) {
                            e.preventDefault();
                            handleCardNavigation(index);
                          }
                        }}
                        sx={{
                          position: 'absolute',
                          width: isMobile ? '85%' : '80%',
                          height: isMobile ? '55%' : '60%',
                          maxWidth: isMobile ? '320px' : '450px',
                          borderRadius: 4,
                          overflow: 'hidden',
                          boxShadow: isActive 
                            ? '0 30px 60px rgba(0,0,0,0.25)'
                            : '0 15px 35px rgba(0,0,0,0.2)',
                          transform: `translate3d(${xTranslate}, ${yTranslate}, ${zTranslate}) 
                                      rotateY(${rotateY}) 
                                      scale(${scale})`,
                          opacity: opacity,
                          zIndex: zIndex,
                          transition: `all 0.8s ${isActive ? 'cubic-bezier(0.165, 0.84, 0.44, 1)' : 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'}`,
                          cursor: 'pointer',
                          transformStyle: 'preserve-3d',
                          transformOrigin: isBeforeActive ? 'left center' : isAfterActive ? 'right center' : 'center center',
                          '&:hover': isActive ? {
                            transform: `translate3d(${xTranslate}, calc(${yTranslate} - 10px), ${zTranslate}) 
                                        rotateY(${rotateY}) 
                                        scale(${scale * 1.03})`,
                            boxShadow: '0 40px 70px rgba(0,0,0,0.3)'
                          } : {},
                          textDecoration: 'none'
                        }}
                      >
                        {/* Card background with gradient overlay */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundImage: `url(${backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            '&::before': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              backgroundColor: 'rgba(0,0,0,0.05)',
                              zIndex: 1
                            },
                            '&::after': {
                              content: '""',
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              background: isActive 
                                ? 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)'
                                : 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.1) 100%)',
                              zIndex: 1
                            }
                          }}
                        />
                        
                        {/* Card content - property info */}
                        <Box sx={{ 
                          position: 'relative', 
                          zIndex: 1, 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          p: 3
                        }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" sx={{ 
                              color: theme.palette.secondary.light, 
                              fontWeight: 'bold',
                              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                            }}>
                              {new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                maximumFractionDigits: 0,
                              }).format(property.price)}
                            </Typography>
                            
                            <Box sx={{ 
                              display: 'flex', 
                              gap: 1.5,
                              color: 'white',
                              textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                            }}>
                              {property.bedrooms > 0 && (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography variant="body2" fontWeight="medium">
                                    {property.bedrooms} Bed{property.bedrooms > 1 ? 's' : ''}
                                  </Typography>
                                </Box>
                              )}
                              
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Typography variant="body2" fontWeight="medium">
                                  {property.bathrooms} Bath{property.bathrooms > 1 ? 's' : ''}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Box>
                        
                        {/* Property type badge */}
                        {isActive && (
                          <Chip 
                            label={property.propertyType.split(' ')[0]} 
                            size="small"
                            sx={{ 
                              position: 'absolute', 
                              top: 16, 
                              right: 16,
                              bgcolor: theme.palette.secondary.main,
                              color: 'white',
                              fontWeight: 'bold',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                            }}
                          />
                        )}
                        
                        {/* Location badge */}
                        <Typography
                          variant="caption"
                          sx={{
                            position: 'absolute',
                            top: isActive ? 52 : 16,
                            right: 16,
                            color: 'white',
                            fontWeight: 'medium',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            backdropFilter: 'blur(4px)',
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}
                        >
                          <LocationOnIcon sx={{ fontSize: 14 }} />
                          {property.location.split(',')[0].trim()}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>
                
                {/* Navigation Controls - Only show indicator dots */}
                <Box sx={{
                  position: 'absolute',
                  bottom: isMobile ? -45 : -50,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: 2
                }}>
                  {/* Indicator dots */}
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {properties.slice(0, 6).map((_, index) => (
                      <Box
                        key={index}
                        onClick={() => handleCardNavigation(index)}
                        sx={{
                          width: activeCardIndex === index ? 24 : 8,
                          height: 8,
                          borderRadius: 4,
                          bgcolor: activeCardIndex === index 
                            ? theme.palette.primary.main 
                            : alpha(theme.palette.primary.main, 0.3),
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            bgcolor: alpha(theme.palette.primary.main, 0.8)
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Counter Section */}
      <Box 
        ref={statsRef}
        sx={{ 
          py: isMobile ? 4 : 6, 
          bgcolor: theme.palette.primary.main,
          color: 'white',
          borderBottom: `5px solid ${theme.palette.secondary.main}`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
        }}
      >
        <Container>
          <Grid container spacing={3} justifyContent="center">
            {[
              { label: 'Properties', value: counters.properties, suffix: '+' },
              { label: 'Happy Clients', value: counters.clients, suffix: '+' },
              { label: 'Cities Covered', value: counters.cities, suffix: '' },
            ].map((stat, index) => (
              <Grid item xs={4} key={index} sx={{ textAlign: 'center' }}>
                <Typography 
                  variant={isMobile ? "h4" : "h3"} 
                  component="div" 
                  sx={{ 
                    fontWeight: 'bold',
                    textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                  }}
                >
                  {stat.value}{stat.suffix}
                </Typography>
                <Typography variant={isMobile ? "body2" : "body1"}>{stat.label}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Properties Section with Category Tabs */}
      <Container sx={{ py: isMobile ? 4 : 8 }}>
        <Slide direction="up" in={animationComplete} timeout={800}>
          <Typography variant={isMobile ? "h5" : "h4"} component="h2" gutterBottom align="center" sx={{ mb: isMobile ? 3 : 4 }}>
            Featured Properties
          </Typography>
        </Slide>
        
        {/* Property Category Tabs */}
        <Box sx={{ maxWidth: isMobile ? '100%' : '60%', mx: 'auto', mb: 4 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            centered={!isMobile}
            sx={{
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: 3
              },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 'medium',
                fontSize: '1rem',
                minWidth: 100
              }
            }}
          >
            {categories.map(category => (
              <Tab 
                key={category.id} 
                icon={category.icon} 
                label={category.label.split(' ')[0]} 
                sx={{ 
                  color: activeTab === categories.findIndex(c => c.id === category.id) ? 
                    category.color : 'text.secondary',
                }}
              />
            ))}
          </Tabs>
        </Box>
        
        <Grid container spacing={isMobile ? 2 : 4}>
          {isLoading ? (
            // Skeleton loading state
            Array.from(new Array(isMobile ? 6 : 6)).map((_, index) => (
              <Grid item key={index} xs={12} sm={6} md={4}>
                <Card sx={{ height: '100%' }}>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" height={32} width="80%" />
                    <Skeleton variant="text" height={20} width="60%" />
                    <Skeleton variant="text" height={28} width="40%" sx={{ my: 1 }} />
                    <Skeleton variant="rectangular" height={36} width="100%" sx={{ mt: 2 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            // Actual property cards
            featuredProperties.map((property, index) => (
              <Grid item key={property.id} xs={12} sm={6} md={4} lg={4}>
                <Fade in={animationComplete} timeout={1000} style={{ transitionDelay: `${200 * index}ms` }}>
                  <Card sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: isMobile ? 'column' : 'column',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: '0 16px 30px rgba(0,0,0,0.15)'
                    }
                  }}>
                    {isMobile ? (
                      // Mobile card layout - changed to vertical layout for consistency
                      <>
                        <CardMedia
                          component="img"
                          sx={{ height: 140 }}
                          image={property.images && property.images.length > 0 ? property.images[0] : FALLBACK_IMAGE}
                          alt={property.title}
                          onError={(e) => {
                            e.target.src = FALLBACK_IMAGE;
                          }}
                        />
                        <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                          <CardContent sx={{ flex: '1 0 auto', p: 1.5, pb: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'start', mb: 0.5 }}>
                              <LocationOnIcon color="action" fontSize="small" sx={{ mt: 0.3, mr: 0.5 }} />
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {property.location}
                              </Typography>
                            </Box>
                            <Typography variant="subtitle1" component="div" noWrap fontWeight="bold">
                              {property.title}
                            </Typography>
                            <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mt: 0.5 }}>
                              {new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                maximumFractionDigits: 0,
                              }).format(property.price)}
                            </Typography>
                          </CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', px: 1.5, pb: 1 }}>
                            <Button 
                              variant="contained" 
                              component={Link} 
                              to={`/property/${property.id}`} 
                              size="small"
                              fullWidth
                            >
                              View Details
                            </Button>
                          </Box>
                        </Box>
                      </>
                    ) : (
                      // Desktop card layout with hover effects
                      <>
                        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                          <CardMedia
                            component="img"
                            height="240"
                            image={property.images && property.images.length > 0 ? property.images[0] : FALLBACK_IMAGE}
                            alt={property.title}
                            onError={(e) => {
                              e.target.src = FALLBACK_IMAGE;
                            }}
                            sx={{
                              transition: 'transform 0.6s ease',
                              '&:hover': {
                                transform: 'scale(1.08)',
                              }
                            }}
                          />
                        </Box>
                        <CardContent sx={{ flexGrow: 1, p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <LocationOnIcon color="action" fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2" color="text.secondary">
                              {property.location}
                            </Typography>
                          </Box>
                          <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold' }}>
                            {property.title}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, my: 2, color: 'text.secondary' }}>
                            <Typography variant="body2">{property.size}</Typography>
                            {property.bedrooms > 0 && (
                              <Typography variant="body2">{property.bedrooms} Bed{property.bedrooms > 1 ? 's' : ''}</Typography>
                            )}
                            <Typography variant="body2">{property.bathrooms} Bath{property.bathrooms > 1 ? 's' : ''}</Typography>
                          </Box>
                          <Divider sx={{ my: 2 }} />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6" color="primary" fontWeight="bold">
                              {new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                maximumFractionDigits: 0,
                              }).format(property.price)}
                            </Typography>
                            <Button 
                              variant="contained" 
                              component={Link} 
                              to={`/property/${property.id}`} 
                              sx={{ 
                                borderRadius: 6,
                                transition: 'all 0.3s',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: '0 6px 10px rgba(0,0,0,0.2)',
                                }
                              }}
                              endIcon={<KeyboardArrowRightIcon />}
                            >
                              Details
                            </Button>
                          </Box>
                        </CardContent>
                      </>
                    )}
                  </Card>
                </Fade>
              </Grid>
            ))
          )}
        </Grid>
        
        <Box sx={{ textAlign: 'center', mt: isMobile ? 4 : 6 }}>
          <Fade in={animationComplete} timeout={1000} style={{ transitionDelay: '800ms' }}>
            <Button 
              variant="contained" 
              component={Link} 
              to="/listings"
              size={isMobile ? "medium" : "large"}
              sx={{
                borderRadius: '30px',
                transition: 'all 0.3s',
                px: 4,
                py: 1.2,
                '&:hover': {
                  transform: 'translateY(-3px)',
                  boxShadow: '0 8px 15px rgba(0,0,0,0.15)',
                }
              }}
            >
              View All Properties
            </Button>
          </Fade>
        </Box>
      </Container>

      {/* Services Section with animations */}
      <Box sx={{ bgcolor: 'grey.100', py: isMobile ? 5 : 8, mt: 4 }}>
        <Container>
          <Slide direction="up" in={animationComplete} timeout={800}>
            <Typography variant={isMobile ? "h5" : "h4"} component="h2" gutterBottom align="center" sx={{ mb: isMobile ? 3 : 5 }}>
              Our Services
            </Typography>
          </Slide>
          
          <Grid container spacing={isMobile ? 3 : 4}>
            {/* Service cards with animations */}
            {[
              {
                title: 'Residential Properties',
                description: 'Find the perfect home for your family with our wide range of residential properties.',
                icon: <HomeIcon fontSize="large" />,
                delay: 0,
                color: theme.palette.primary.main
              },
              {
                title: 'Commercial Properties',
                description: 'Discover premium commercial spaces for your business to thrive and grow.',
                icon: <BusinessIcon fontSize="large" />,
                delay: 200,
                color: theme.palette.secondary.main
              },
              {
                title: 'Property Consultation',
                description: 'Get expert advice from our experienced team to make the best property decisions.',
                icon: <VillaIcon fontSize="large" />,
                delay: 400,
                color: '#9c27b0'
              }
            ].map((service, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Fade in={animationComplete} timeout={1000} style={{ transitionDelay: `${service.delay}ms` }}>
                  <Box sx={{ 
                    textAlign: 'center', 
                    p: 4,
                    height: '100%',
                    bgcolor: 'white',
                    borderRadius: 4,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                    },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}>
                    <Box 
                      sx={{ 
                        bgcolor: alpha(service.color, 0.1), 
                        color: service.color,
                        borderRadius: '50%',
                        width: 70,
                        height: 70,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mb: 2
                      }}
                    >
                      {service.icon}
                    </Box>
                    <Typography variant={isMobile ? "h6" : "h5"} component="h3" gutterBottom fontWeight="bold">
                      {service.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                      {service.description}
                    </Typography>
                  </Box>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box sx={{ py: isMobile ? 5 : 8 }}>
        <Container>
          <Slide direction="up" in={animationComplete} timeout={800}>
            <Typography variant={isMobile ? "h5" : "h4"} component="h2" gutterBottom align="center" sx={{ mb: 1 }}>
              What Our Clients Say
            </Typography>
          </Slide>
          
          <Slide direction="up" in={animationComplete} timeout={800}>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: isMobile ? 4 : 5, maxWidth: 700, mx: 'auto' }}>
              Don't just take our word for it - hear from some of our satisfied clients
            </Typography>
          </Slide>

          <Grid container spacing={3}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Fade in={animationComplete} timeout={1500} style={{ transitionDelay: `${index * 200}ms` }}>
                  <Card sx={{ 
                    height: '100%',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'visible',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -15,
                      left: 20,
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      zIndex: -1
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: -20,
                      right: 25,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: alpha(theme.palette.secondary.main, 0.07),
                      zIndex: -1
                    }
                  }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ mb: 2, color: theme.palette.primary.main }}>
                        <FormatQuoteIcon fontSize="large" />
                      </Box>
                      
                      <Typography variant="body1" sx={{ mb: 3, fontStyle: 'italic', minHeight: 120 }}>
                        "{testimonial.text}"
                      </Typography>
                      
                      <Divider sx={{ mb: 2 }} />
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            src={testimonial.avatar} 
                            alt={testimonial.name}
                            sx={{ width: 50, height: 50, mr: 2, border: `2px solid ${theme.palette.primary.main}` }}
                          />
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {testimonial.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <LocationOnIcon fontSize="small" color="action" sx={{ mr: 0.5, fontSize: 16 }} />
                              <Typography variant="body2" color="text.secondary">
                                {testimonial.location}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Rating value={testimonial.rating} readOnly size="small" />
                          {testimonial.rating === 5 && (
                            <VerifiedIcon color="primary" fontSize="small" sx={{ ml: 0.5 }} />
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Newsletter Section */}
      <Box 
        sx={{ 
          bgcolor: theme.palette.primary.main, 
          color: 'white', 
          py: isMobile ? 5 : 8,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box 
          sx={{ 
            position: 'absolute',
            right: -100,
            top: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.secondary.main, 0.2),
          }}
        />
        <Box 
          sx={{ 
            position: 'absolute',
            left: -150,
            bottom: -150,
            width: 400,
            height: 400,
            borderRadius: '50%',
            bgcolor: alpha('#fff', 0.05),
          }}
        />
        
        <Container sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={7}>
              <Fade in={animationComplete} timeout={1000}>
                <Typography variant={isMobile ? "h5" : "h3"} component="h2" gutterBottom>
                  Get Property Updates
                </Typography>
              </Fade>
              <Fade in={animationComplete} timeout={1000} style={{ transitionDelay: '200ms' }}>
                <Typography variant="body1" sx={{ mb: 3, maxWidth: 600 }}>
                  Be the first to know about new properties, exclusive offers, and market trends. Subscribe to our newsletter.
                </Typography>
              </Fade>
            </Grid>
            <Grid item xs={12} md={5}>
              <Fade in={animationComplete} timeout={1000} style={{ transitionDelay: '400ms' }}>
                <Paper 
                  component="form" 
                  elevation={4} 
                  sx={{ 
                    p: 0.5, 
                    display: 'flex', 
                    alignItems: 'center',
                    borderRadius: 5,
                    bgcolor: 'white'
                  }}
                  onSubmit={handleSubscribe}
                >
                  {emailSubmitted ? (
                    <Box sx={{ p: 2, textAlign: 'center', width: '100%' }}>
                      <Typography variant="body1" color="primary" fontWeight="bold">
                        Thank you for subscribing!
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <TextField
                        fullWidth
                        placeholder="Enter your email"
                        type="email"
                        variant="standard"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        InputProps={{
                          disableUnderline: true,
                          startAdornment: (
                            <InputAdornment position="start" sx={{ pl: 1 }}>
                              <EmailIcon color="primary" />
                            </InputAdornment>
                          ),
                          sx: { p: 1 }
                        }}
                      />
                      <Button 
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ 
                          borderRadius: 5, 
                          px: 3, 
                          py: 1,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Subscribe
                      </Button>
                    </>
                  )}
                </Paper>
              </Fade>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section - Only show on desktop */}
      {!isMobile && (
        <Box sx={{ bgcolor: 'grey.100', color: 'text.primary', py: 6 }}>
          <Container>
            <Grid container alignItems="center" justifyContent="space-between" spacing={3}>
              <Grid item xs={12} md={7}>
                <Fade in={animationComplete} timeout={1000}>
                  <Typography variant="h4" component="h2" gutterBottom fontWeight="bold">
                    Ready to Find Your Perfect Property?
                  </Typography>
                </Fade>
                <Fade in={animationComplete} timeout={1000} style={{ transitionDelay: '200ms' }}>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    Contact us today and let us help you find the property that meets all your requirements. Our expert team is ready to assist you.
                  </Typography>
                </Fade>
              </Grid>
              <Grid item xs={12} md={5} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                <Fade in={animationComplete} timeout={1000} style={{ transitionDelay: '400ms' }}>
                  <Button 
                    variant="contained" 
                    component={Link}
                    to="/contact"
                    size="large"
                    sx={{ 
                      color: 'white', 
                      bgcolor: theme.palette.secondary.main, 
                      '&:hover': { 
                        bgcolor: theme.palette.secondary.dark,
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 15px rgba(0,0,0,0.15)',
                      },
                      transition: 'all 0.3s',
                      borderRadius: '30px',
                      px: 4,
                      py: 1.5,
                      fontSize: '1.1rem'
                    }}
                  >
                    Contact Us Now
                  </Button>
                </Fade>
              </Grid>
            </Grid>
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default HomePage; 