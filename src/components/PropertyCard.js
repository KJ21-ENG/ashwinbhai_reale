import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box, Chip, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useIsMobile } from '../utils/deviceDetect';

const PropertyCard = ({ property }) => {
  const { id, title, location, price, propertyType, size, bedrooms, bathrooms, images } = property;
  const isMobile = useIsMobile();
  
  // State for favorite status
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Check if property is in favorites on component mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      const favoriteIds = JSON.parse(storedFavorites);
      setIsFavorite(favoriteIds.includes(id));
    }
  }, [id]);
  
  // Format price to INR with commas
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

  // Toggle favorite status
  const toggleFavorite = (e) => {
    e.preventDefault(); // Prevent card click event
    e.stopPropagation(); // Also stop propagation to parent elements
    
    const storedFavorites = localStorage.getItem('favorites');
    let favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : [];
    
    if (isFavorite) {
      // Remove from favorites
      favoriteIds = favoriteIds.filter(favoriteId => favoriteId !== id);
    } else {
      // Add to favorites
      favoriteIds.push(id);
    }
    
    localStorage.setItem('favorites', JSON.stringify(favoriteIds));
    setIsFavorite(!isFavorite);
  };

  return (
    <Card 
      sx={{ 
        maxWidth: '100%', 
        height: '100%', 
        display: 'flex', 
        flexDirection: isMobile ? 'row' : 'column',
        overflow: isMobile ? 'hidden' : 'visible',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 20px rgba(0,0,0,0.1)',
        }
      }}
    >
      {/* Mobile Layout */}
      {isMobile ? (
        <>
          <CardMedia
            component="img"
            sx={{ width: 140, height: 140, objectFit: 'cover' }}
            image={images[0] || '/images/placeholder.jpg'}
            alt={title}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, position: 'relative' }}>
            <CardContent sx={{ flex: '1 0 auto', p: 1.5, pb: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box sx={{ maxWidth: 'calc(100% - 40px)' }}>
                  <Chip 
                    label={propertyType} 
                    color="primary"
                    size="small"
                    sx={{ mb: 0.5 }}
                  />
                  <Typography variant="subtitle1" component="div" noWrap fontWeight="bold">
                    {title}
                  </Typography>
                </Box>
                <IconButton 
                  size="small" 
                  onClick={toggleFavorite}
                  sx={{ position: 'absolute', top: 4, right: 4 }}
                >
                  {isFavorite ? (
                    <FavoriteIcon color="error" fontSize="small" />
                  ) : (
                    <FavoriteBorderIcon fontSize="small" />
                  )}
                </IconButton>
              </Box>
              
              <Typography variant="body2" color="text.secondary" noWrap>
                {location}
              </Typography>
              
              <Typography variant="subtitle2" color="primary" fontWeight="bold" sx={{ mt: 0.5 }}>
                {formattedPrice}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1, mt: 0.5, fontSize: '0.75rem' }}>
                <Typography variant="caption">{size}</Typography>
                {bedrooms > 0 && (
                  <Typography variant="caption">{bedrooms} Bed{bedrooms > 1 ? 's' : ''}</Typography>
                )}
                <Typography variant="caption">{bathrooms} Bath{bathrooms > 1 ? 's' : ''}</Typography>
              </Box>
            </CardContent>
            
            <Box sx={{ display: 'flex', alignItems: 'center', px: 1.5, pb: 1 }}>
              <Button 
                variant="contained" 
                component={Link} 
                to={`/property/${id}`} 
                size="small"
                fullWidth
              >
                View Details
              </Button>
            </Box>
          </Box>
        </>
      ) : (
        // Desktop Layout
        <>
          <Box sx={{ position: 'relative' }}>
            <CardMedia
              component="img"
              height="200"
              image={images[0] || '/images/placeholder.jpg'}
              alt={title}
              sx={{
                transition: 'transform 0.5s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}
            />
            <IconButton 
              size="small" 
              onClick={toggleFavorite}
              sx={{ 
                position: 'absolute', 
                top: 8, 
                right: 8,
                bgcolor: 'rgba(255, 255, 255, 0.8)',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.9)',
                }
              }}
            >
              {isFavorite ? (
                <FavoriteIcon color="error" sx={{ 
                  transform: 'scale(1.2)',
                  transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}/>
              ) : (
                <FavoriteBorderIcon sx={{ 
                  transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  '&:hover': { transform: 'scale(1.2)' } 
                }}/>
              )}
            </IconButton>
          </Box>
          <CardContent sx={{ flexGrow: 1 }}>
            <Chip 
              label={propertyType} 
              color="primary"
              size="small"
              sx={{ mb: 1 }}
            />
            <Typography gutterBottom variant="h5" component="div">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {location}
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              {formattedPrice}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Typography variant="body2">{size}</Typography>
              {bedrooms > 0 && (
                <Typography variant="body2">{bedrooms} Bed{bedrooms > 1 ? 's' : ''}</Typography>
              )}
              <Typography variant="body2">{bathrooms} Bath{bathrooms > 1 ? 's' : ''}</Typography>
            </Box>
            <Button 
              variant="contained" 
              component={Link} 
              to={`/property/${id}`} 
              fullWidth
            >
              View Details
            </Button>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default PropertyCard; 