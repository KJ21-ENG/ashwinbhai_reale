import React, { useState, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  MenuItem, 
  Slider, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  AppBar,
  Toolbar,
  IconButton,
  InputAdornment,
  Paper,
  Chip,
  Grow,
  CircularProgress,
  Zoom,
  Collapse
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import TuneIcon from '@mui/icons-material/Tune';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const MobileSearchFilter = ({ filters, setFilters, onSearch, onResetFilters }) => {
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({ ...filters });
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [showFilterChips, setShowFilterChips] = useState(false);
  
  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filters.location && filters.location !== 'All Locations' && filters.location.trim() !== '') count++;
    if (filters.propertyType !== 'All Types') count++;
    if (filters.bedrooms !== '') count++;
    if (filters.priceRange[0] > 1000000 || filters.priceRange[1] < 50000000) count++;
    
    setActiveFilters(count);
    setShowFilterChips(count > 0);
  }, [filters]);
  
  // Locations in Gujarat for dropdown
  const locations = [
    'All Locations',
    'Ahmedabad',
    'Vadodara',
    'Surat',
    'Rajkot',
    'Gandhinagar',
    'Dwarka',
    'Vapi'
  ];

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
  
  // Handle quick search text change
  const handleQuickSearchChange = (e) => {
    const searchText = e.target.value;
    setFilters(prev => ({
      ...prev,
      searchText
    }));
    
    // Auto search after typing with loading state
    if (e.target.value.length >= 3 || e.target.value.length === 0) {
      setIsSearching(true);
      const timer = setTimeout(() => {
        onSearch();
        setIsSearching(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  };
  
  // Open filter dialog
  const handleOpenFilters = () => {
    setTempFilters({ ...filters });
    setFilterDialogOpen(true);
  };
  
  // Handle input changes in the filter dialog
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle price range slider
  const handlePriceChange = (event, newValue) => {
    setTempFilters(prev => ({
      ...prev,
      priceRange: newValue
    }));
  };
  
  // Apply filters and close dialog
  const applyFilters = () => {
    // Ensure proper bedrooms filtering
    let fixedTempFilters = {...tempFilters};
    
    // If bedrooms is a string with a number, convert to number for proper comparison
    if (fixedTempFilters.bedrooms !== '' && fixedTempFilters.bedrooms !== '5+') {
      fixedTempFilters.bedrooms = fixedTempFilters.bedrooms.toString();
    }
    
    console.log("Applying filters:", fixedTempFilters);
    
    // Update filters immediately
    setFilters(fixedTempFilters);
    setFilterDialogOpen(false);
    setIsSearching(true);
    
    // Apply search right away instead of waiting
    onSearch();
    
    // Delay only to hide the loading indicator
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };
  
  // Clear all filters
  const clearFilters = () => {
    console.log("Clearing filters...");
    
    const clearedFilters = {
      ...filters,
      searchText: '', // Also clear the search text
      location: '',
      propertyType: 'All Types',
      bedrooms: '',
      priceRange: [1000000, 50000000]
    };
    
    console.log("New cleared filters:", clearedFilters);
    
    // Update both temp and actual filters immediately
    setTempFilters(clearedFilters);
    setFilters(clearedFilters);
    setFilterDialogOpen(false);
    
    setIsSearching(true);
    
    // Apply reset immediately instead of waiting
    if (onResetFilters) {
      onResetFilters();
    } else {
      onSearch();
    }
    
    // Just wait to hide the loading indicator
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };
  
  // Cancel and close dialog
  const handleCancel = () => {
    setFilterDialogOpen(false);
  };
  
  // Remove single filter chip
  const handleRemoveFilter = (filterName) => {
    const updatedFilters = { ...filters };
    
    switch(filterName) {
      case 'location':
        updatedFilters.location = '';
        break;
      case 'propertyType':
        updatedFilters.propertyType = 'All Types';
        break;
      case 'bedrooms':
        updatedFilters.bedrooms = '';
        break;
      case 'priceRange':
        updatedFilters.priceRange = [1000000, 50000000];
        break;
      case 'all':
        // Reset all filters
        if (onResetFilters) {
          onResetFilters();
          return; // Early return as onResetFilters handles everything
        }
        updatedFilters.location = '';
        updatedFilters.propertyType = 'All Types';
        updatedFilters.bedrooms = '';
        updatedFilters.priceRange = [1000000, 50000000];
        updatedFilters.searchText = '';
        break;
      default:
        break;
    }
    
    // Immediately update filters
    setFilters(updatedFilters);
    setIsSearching(true);
    
    // Apply search immediately
    onSearch();
    
    // Just wait to hide the loading indicator
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };
  
  // Format price for display
  const formatPrice = (value) => {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)} Cr`;
    }
    return `₹${(value / 100000).toFixed(1)} Lac`;
  };

  return (
    <>
      {/* Mobile Search Bar */}
      <Box sx={{ 
        p: 2, 
        position: 'sticky', 
        top: 0, 
        zIndex: 999, 
        bgcolor: 'white', 
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Paper 
          elevation={2} 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            p: 0.5,
            pl: 1.5,
            borderRadius: 8,
            bgcolor: '#f5f5f5'
          }}
        >
          <SearchIcon color="action" fontSize="small" />
          <TextField
            placeholder="Search by location or property name"
            value={filters.searchText || ''}
            onChange={handleQuickSearchChange}
            fullWidth
            variant="standard"
            size="small"
            InputProps={{
              disableUnderline: true,
              endAdornment: isSearching && (
                <InputAdornment position="end">
                  <CircularProgress size={20} color="inherit" />
                </InputAdornment>
              ),
            }}
          />
          <Zoom in={true}>
            <IconButton 
              color="primary" 
              onClick={handleOpenFilters}
              sx={{ 
                bgcolor: activeFilters > 0 ? 'primary.main' : 'transparent',
                color: activeFilters > 0 ? 'white' : 'primary.main',
                position: 'relative'
              }}
            >
              <TuneIcon />
              {activeFilters > 0 && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    bgcolor: 'secondary.main',
                    color: 'white',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    border: '1px solid white'
                  }}
                >{activeFilters}</Box>
              )}
            </IconButton>
          </Zoom>
        </Paper>
        
        {/* Active filter chips */}
        <Collapse in={showFilterChips}>
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'nowrap', 
            gap: 1, 
            mt: 1,
            overflowX: 'auto',
            pb: 1,
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            scrollbarWidth: 'none'
          }}>
            {filters.location && filters.location.trim() !== '' && (
              <Chip 
                icon={<LocationOnIcon fontSize="small" />}
                label={filters.location} 
                onDelete={() => handleRemoveFilter('location')}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            
            {filters.propertyType !== 'All Types' && (
              <Chip 
                label={filters.propertyType} 
                onDelete={() => handleRemoveFilter('propertyType')}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            
            {filters.bedrooms !== '' && (
              <Chip 
                label={filters.bedrooms === '5+' ? '5+ BHK' : `${filters.bedrooms} BHK`} 
                onDelete={() => handleRemoveFilter('bedrooms')}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            
            {(filters.priceRange[0] > 1000000 || filters.priceRange[1] < 50000000) && (
              <Chip 
                label={`${formatPrice(filters.priceRange[0])} - ${formatPrice(filters.priceRange[1])}`} 
                onDelete={() => handleRemoveFilter('priceRange')}
                color="primary"
                variant="outlined"
                size="small"
              />
            )}
            
            {activeFilters > 1 && (
              <Chip 
                label="Clear All" 
                onClick={() => handleRemoveFilter('all')}
                color="secondary"
                size="small"
              />
            )}
          </Box>
        </Collapse>
      </Box>
      
      {/* Filter Dialog */}
      <Dialog 
        fullScreen 
        open={filterDialogOpen} 
        onClose={handleCancel}
        sx={{ '& .MuiDialog-paper': { bgcolor: '#f5f5f5' } }}
      >
        <AppBar position="static" elevation={0} color="transparent">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCancel}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Filter Properties
            </Typography>
          </Toolbar>
        </AppBar>
        
        <DialogContent>
          <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Location
            </Typography>
            <TextField
              name="location"
              value={tempFilters.location}
              onChange={handleFilterChange}
              fullWidth
              variant="outlined"
              placeholder="Enter city name or area"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Paper>
          
          <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Property Type
            </Typography>
            <TextField
              select
              name="propertyType"
              value={tempFilters.propertyType}
              onChange={handleFilterChange}
              fullWidth
              variant="outlined"
            >
              {propertyTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Paper>
          
          <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Bedrooms
            </Typography>
            <TextField
              select
              fullWidth
              margin="dense"
              id="bedrooms"
              name="bedrooms"
              label="Bedrooms"
              value={tempFilters.bedrooms}
              onChange={handleFilterChange}
            >
              {bedroomOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Paper>
          
          <Paper elevation={1} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Price Range
            </Typography>
            <Box sx={{ px: 1 }}>
              <Typography gutterBottom sx={{ textAlign: 'center', mt: 2, color: 'primary.main', fontWeight: 'bold' }}>
                {formatPrice(tempFilters.priceRange[0])} - {formatPrice(tempFilters.priceRange[1])}
              </Typography>
              <Slider
                value={tempFilters.priceRange}
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
            </Box>
          </Paper>
        </DialogContent>
        
        <DialogActions sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between' }}>
          <Button 
            onClick={clearFilters} 
            color="inherit"
            variant="outlined"
            startIcon={<FilterListIcon />}
          >
            Reset
          </Button>
          <Button 
            onClick={applyFilters} 
            variant="contained" 
            color="primary"
            size="large"
            sx={{ 
              px: 4, 
              borderRadius: 5,
              boxShadow: '0 4px 12px rgba(46, 125, 50, 0.2)'
            }}
          >
            Show Results
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Loading overlay for mobile search */}
      {isSearching && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={40} />
            <Typography variant="body2" sx={{ mt: 2 }}>
              Finding properties...
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

export default MobileSearchFilter; 