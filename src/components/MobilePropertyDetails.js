import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  Button, 
  IconButton, 
  SwipeableDrawer,
  Divider,
  Dialog,
  AppBar,
  Toolbar,
  Slide,
  DialogContent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import PhoneIcon from '@mui/icons-material/Phone';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import MobileImageGallery from './MobileImageGallery';
import ContactForm from './ContactForm';
import properties from '../data/properties.json';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MobilePropertyDetails = ({ property, isFavorite, toggleFavorite }) => {
  const navigate = useNavigate();
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);
  
  // Format price to INR with commas
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };
  
  const goBack = () => {
    navigate(-1);
  };
  
  const openContactModal = () => {
    setContactModalOpen(true);
  };
  
  const closeContactModal = () => {
    setContactModalOpen(false);
  };
  
  const toggleDetails = () => {
    setDetailsExpanded(!detailsExpanded);
  };
  
  // Mock share function (would be implemented with Web Share API in production)
  const shareProperty = () => {
    console.log('Sharing property:', property.title);
    alert('Sharing is not implemented in this prototype.');
  };
  
  // Get similar properties based on property type and location
  const similarProperties = properties
    .filter(p => 
      p.id !== property.id && 
      (p.propertyType === property.propertyType || p.location === property.location)
    )
    .slice(0, 2); // Limit to 2 similar properties
  
  return (
    <Box sx={{ pb: 9 }}>
      {/* Top Bar */}
      <Box 
        sx={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1200,
          bgcolor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          justifyContent: 'space-between',
          p: 1
        }}
      >
        <IconButton 
          onClick={goBack}
          sx={{ color: 'white' }}
        >
          <ArrowBackIcon />
        </IconButton>
        
        <Box>
          <IconButton 
            onClick={toggleFavorite}
            sx={{ color: 'white' }}
          >
            {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          </IconButton>
          
          <IconButton 
            onClick={shareProperty}
            sx={{ color: 'white' }}
          >
            <ShareIcon />
          </IconButton>
        </Box>
      </Box>
      
      {/* Image Gallery */}
      <MobileImageGallery images={property.images} title={property.title} />
      
      {/* Quick Info */}
      <Box sx={{ p: 2 }}>
        <Chip 
          label={property.propertyType} 
          color={property.propertyType === 'Residential' ? 'primary' : 'secondary'}
          size="small"
          sx={{ mb: 1 }}
        />
        
        <Typography variant="h5" component="h1" fontWeight="bold">
          {property.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <LocationOnIcon color="action" fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            {property.location}
          </Typography>
        </Box>
        
        <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mt: 2, mb: 2 }}>
          {formatPrice(property.price)}
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          bgcolor: 'grey.100', 
          p: 1.5, 
          borderRadius: 1,
          mb: 2
        }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SquareFootIcon color="action" />
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {property.size}
            </Typography>
          </Box>
          
          {property.bedrooms > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <BedIcon color="action" />
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {property.bedrooms} {property.bedrooms > 1 ? 'Beds' : 'Bed'}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <BathtubIcon color="action" />
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              {property.bathrooms} {property.bathrooms > 1 ? 'Baths' : 'Bath'}
            </Typography>
          </Box>
        </Box>
        
        <Button 
          variant="contained" 
          fullWidth 
          sx={{ mb: 2 }}
          onClick={openContactModal}
          startIcon={<PhoneIcon />}
        >
          Contact Agent
        </Button>
      </Box>
      
      <Divider />
      
      {/* Description summary with expand/collapse */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Description
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          {detailsExpanded 
            ? property.description 
            : `${property.description.substring(0, 150)}...`}
        </Typography>
        
        <Button 
          variant="text" 
          size="small" 
          onClick={toggleDetails}
          sx={{ mt: 1 }}
        >
          {detailsExpanded ? 'Show Less' : 'Read More'}
        </Button>
      </Box>
      
      <Divider />
      
      {/* Features Section */}
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Features & Amenities
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {property.features.map((feature, index) => (
            <Chip key={index} label={feature} size="small" />
          ))}
        </Box>
      </Box>
      
      {/* Similar Properties Section - if available */}
      {similarProperties.length > 0 && (
        <>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Similar Properties
            </Typography>
            
            <Box sx={{ display: 'flex', overflow: 'auto', pb: 1, gap: 2 }}>
              {similarProperties.map((similarProperty) => (
                <Box 
                  key={similarProperty.id}
                  sx={{ 
                    minWidth: 200,
                    cursor: 'pointer',
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}
                  onClick={() => navigate(`/property/${similarProperty.id}`)}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: 100,
                      backgroundImage: `url(${similarProperty.images[0]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <Box sx={{ p: 1 }}>
                    <Typography variant="subtitle2" noWrap>
                      {similarProperty.title}
                    </Typography>
                    <Typography variant="body2" color="primary" fontWeight="bold">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        maximumFractionDigits: 0,
                      }).format(similarProperty.price)}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
          <Divider />
        </>
      )}
      
      {/* Contact Modal */}
      <Dialog
        fullScreen
        open={contactModalOpen}
        onClose={closeContactModal}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={closeContactModal}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Contact Agent
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Box sx={{ mt: 2, mb: 4 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Inquiry about:
            </Typography>
            <Typography variant="body1">
              {property.title}
            </Typography>
          </Box>
          <ContactForm propertyTitle={property.title} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MobilePropertyDetails; 