import React from 'react';
import { Box, TextField, MenuItem, Slider, Typography, Button, Paper, Grid } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const SearchFilter = ({ filters, setFilters, onSearch }) => {
  // Property types for dropdown
  const propertyTypes = [
    'All Types',
    'Residential',
    'Commercial'
  ];
  
  // Bedroom options
  const bedroomOptions = [
    { value: '', label: 'Any' },
    { value: '1', label: '1 BHK' },
    { value: '2', label: '2 BHK' },
    { value: '3', label: '3 BHK' },
    { value: '4', label: '4 BHK' },
    { value: '5+', label: '5+ BHK' }
  ];

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle price range slider
  const handlePriceChange = (event, newValue) => {
    setFilters(prev => ({
      ...prev,
      priceRange: newValue
    }));
  };

  // Format price for display
  const formatPrice = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)} Cr`;
    }
    return `₹${(value / 100000).toFixed(1)} Lac`;
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        Find Your Perfect Property
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            label="Location"
            name="location"
            value={filters.location === 'All Locations' ? '' : filters.location}
            onChange={handleChange}
            fullWidth
            margin="normal"
            placeholder="Enter city name or area"
            InputProps={{
              startAdornment: (
                <LocationOnIcon color="action" sx={{ mr: 1 }} />
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            label="Property Type"
            name="propertyType"
            value={filters.propertyType}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {propertyTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            select
            label="Bedrooms"
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            {bedroomOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ width: '100%', mt: 3 }}>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              onClick={onSearch}
            >
              Search Properties
            </Button>
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Typography gutterBottom>
            Price Range: {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
          </Typography>
          <Slider
            value={filters.priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            valueLabelFormat={formatPrice}
            min={1000000}
            max={50000000}
            step={500000}
            marks={[
              { value: 1000000, label: '10L' },
              { value: 10000000, label: '1Cr' },
              { value: 25000000, label: '2.5Cr' },
              { value: 50000000, label: '5Cr' }
            ]}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default SearchFilter; 