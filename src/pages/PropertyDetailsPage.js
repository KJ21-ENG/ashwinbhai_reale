import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Chip, 
  Button, 
  Divider, 
  Paper,
  Modal,
  Card,
  CardMedia,
  IconButton
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ContactForm from '../components/ContactForm';
import MobilePropertyDetails from '../components/MobilePropertyDetails';
import properties from '../data/properties.json';
import { useIsMobile } from '../utils/deviceDetect';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const isMobile = useIsMobile();
  
  // Find property by ID
  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      const foundProperty = properties.find(p => p.id === parseInt(id));
      setProperty(foundProperty || null);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [id]);
  
  // Check if property is in favorites
  useEffect(() => {
    if (property) {
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        const favoriteIds = JSON.parse(storedFavorites);
        setIsFavorite(favoriteIds.includes(property.id));
      }
    }
  }, [property]);
  
  // Handle modal open/close
  const handleContactModalOpen = () => setContactModalOpen(true);
  const handleContactModalClose = () => setContactModalOpen(false);
  
  // Handle image selection
  const handleImageClick = (index) => {
    setSelectedImage(index);
  };
  
  // Toggle favorite status
  const toggleFavorite = () => {
    if (!property) return;
    
    const storedFavorites = localStorage.getItem('favorites');
    let favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];
    
    if (isFavorite) {
      // Remove from favorites
      favoriteIds = favoriteIds.filter(favoriteId => favoriteId !== property.id);
    } else {
      // Add to favorites
      favoriteIds.push(property.id);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favoriteIds));
    setIsFavorite(!isFavorite);
  };
  
  // Format price to INR with commas
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5">Loading property details...</Typography>
      </Container>
    );
  }
  
  if (!property) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="error">Property not found</Typography>
        <Button 
          component={Link} 
          to="/listings" 
          variant="contained" 
          sx={{ mt: 3 }}
          startIcon={<ArrowBackIcon />}
        >
          Back to Listings
        </Button>
      </Container>
    );
  }
  
  // Render mobile version if on a mobile device
  if (isMobile) {
    return <MobilePropertyDetails property={property} isFavorite={isFavorite} toggleFavorite={toggleFavorite} />;
  }
  
  // Desktop version
  return (
    <Container sx={{ py: 8 }}>
      {/* Back to listings button */}
      <Button 
        component={Link} 
        to="/listings" 
        variant="outlined" 
        sx={{ mb: 4 }}
        startIcon={<ArrowBackIcon />}
      >
        Back to Listings
      </Button>
      
      <Grid container spacing={4}>
        {/* Left column - Image gallery */}
        <Grid item xs={12} md={7}>
          <Box sx={{ position: 'relative' }}>
            <Card>
              <CardMedia
                component="img"
                height="400"
                image={property.images[selectedImage] || '/images/placeholder.jpg'}
                alt={property.title}
              />
            </Card>
            <IconButton
              onClick={toggleFavorite}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                }
              }}
            >
              {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>
          
          {/* Thumbnail gallery */}
          {property.images.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1, mt: 2, overflowX: 'auto', pb: 1 }}>
              {property.images.map((image, index) => (
                <Box
                  key={index}
                  onClick={() => handleImageClick(index)}
                  sx={{
                    width: 80,
                    height: 60,
                    backgroundImage: `url(${image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                    border: index === selectedImage ? '2px solid #1976d2' : '2px solid transparent',
                    borderRadius: 1,
                    flexShrink: 0,
                  }}
                />
              ))}
            </Box>
          )}
        </Grid>
        
        {/* Right column - Property details */}
        <Grid item xs={12} md={5}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Chip 
              label={property.propertyType} 
              color={property.propertyType === 'Residential' ? 'primary' : 'secondary'}
              size="small"
              sx={{ mb: 2 }}
            />
            
            <Typography variant="h4" component="h1" gutterBottom>
              {property.title}
            </Typography>
            
            <Typography variant="subtitle1" gutterBottom>
              {property.location}
            </Typography>
            
            <Typography variant="h5" color="primary" sx={{ my: 2 }}>
              {formatPrice(property.price)}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Property Size</Typography>
                <Typography variant="body1">{property.size}</Typography>
              </Grid>
              
              {property.bedrooms > 0 && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Bedrooms</Typography>
                  <Typography variant="body1">{property.bedrooms}</Typography>
                </Grid>
              )}
              
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">Bathrooms</Typography>
                <Typography variant="body1">{property.bathrooms}</Typography>
              </Grid>
            </Grid>
            
            <Button 
              variant="contained" 
              fullWidth 
              size="large"
              onClick={handleContactModalOpen}
              sx={{ mb: 2 }}
            >
              Contact Agent
            </Button>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Description Section */}
      <Paper elevation={1} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Description
        </Typography>
        <Typography variant="body1" paragraph>
          {property.description}
        </Typography>
      </Paper>
      
      {/* Features Section */}
      <Paper elevation={1} sx={{ p: 3, mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Features & Amenities
        </Typography>
        <Grid container spacing={2}>
          {property.features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Chip label={feature} sx={{ my: 0.5 }} />
            </Grid>
          ))}
        </Grid>
      </Paper>
      
      {/* Contact Modal */}
      <Modal
        open={contactModalOpen}
        onClose={handleContactModalClose}
        aria-labelledby="contact-modal-title"
      >
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: { xs: '90%', sm: 600 }, 
          bgcolor: 'background.paper', 
          boxShadow: 24, 
          p: 4,
          maxHeight: '90vh',
          overflow: 'auto',
          borderRadius: 1,
        }}>
          <Typography variant="h5" component="h2" id="contact-modal-title" gutterBottom>
            Inquire About {property.title}
          </Typography>
          <ContactForm propertyTitle={property.title} />
        </Box>
      </Modal>
    </Container>
  );
};

export default PropertyDetailsPage; 