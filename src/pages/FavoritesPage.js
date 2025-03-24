import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, Button, IconButton } from '@mui/material';
import PropertyCard from '../components/PropertyCard';
import properties from '../data/properties.json';
import { useIsMobile } from '../utils/deviceDetect';
import DeleteIcon from '@mui/icons-material/Delete';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const isMobile = useIsMobile();
  
  // Simulate retrieving favorites from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      const favoriteIds = JSON.parse(storedFavorites);
      // Filter properties that match the IDs in favorites
      const favoriteProperties = properties.filter(property => 
        favoriteIds.includes(property.id)
      );
      setFavorites(favoriteProperties);
    } else {
      // For demo purposes, use the first 3 properties as favorites
      setFavorites(properties.slice(0, 3));
    }
  }, []);
  
  const removeFavorite = (id) => {
    const updatedFavorites = favorites.filter(property => property.id !== id);
    setFavorites(updatedFavorites);
    
    // Update localStorage
    const favoriteIds = updatedFavorites.map(property => property.id);
    localStorage.setItem('favorites', JSON.stringify(favoriteIds));
  };
  
  return (
    <Container sx={{ py: 8, pb: isMobile ? 12 : 8 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
        Your Favorite Properties
      </Typography>
      
      {favorites.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            You haven't saved any properties yet.
          </Typography>
          <Button variant="contained" href="/listings">
            Browse Properties
          </Button>
        </Box>
      ) : (
        <Grid container spacing={isMobile ? 2 : 4}>
          {favorites.map((property) => (
            <Grid item key={property.id} xs={12} sm={6} md={4}>
              <Box sx={{ position: 'relative' }}>
                <PropertyCard property={property} />
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => removeFavorite(property.id)}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 1,
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                    }
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FavoritesPage; 