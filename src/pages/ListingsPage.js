import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Box, Pagination, Fab } from '@mui/material';
import PropertyCard from '../components/PropertyCard';
import SearchFilter from '../components/SearchFilter';
import MobileSearchFilter from '../components/MobileSearchFilter';
import properties from '../data/properties.json';
import { useIsMobile } from '../utils/deviceDetect';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const ListingsPage = () => {
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(false);
  
  // Initial filter state
  const [filters, setFilters] = useState({
    location: '',
    propertyType: 'All Types',
    bedrooms: '',
    priceRange: [1000000, 50000000], // 10 Lac to 5 Cr
    searchText: '' // Added for mobile search
  });

  // State for filtered properties
  const [filteredProperties, setFilteredProperties] = useState(properties);
  
  // State for pagination
  const [page, setPage] = useState(1);
  const propertiesPerPage = isMobile ? 5 : 6;

  // Handle search based on filters
  const handleSearch = () => {
    setIsLoading(true);
    console.log("Applying filters:", filters);
    
    // Simulate network delay for a more realistic experience
    setTimeout(() => {
      let results = [...properties];
      console.log("Initial properties count:", results.length);
      
      // Filter by search text (for mobile search)
      if (filters.searchText && filters.searchText.trim() !== '') {
        const searchTerm = filters.searchText.toLowerCase();
        results = results.filter(property => 
          property.title.toLowerCase().includes(searchTerm) ||
          property.location.toLowerCase().includes(searchTerm) ||
          property.description.toLowerCase().includes(searchTerm)
        );
        console.log("After text search:", results.length);
      }
      
      // Filter by location if specified
      if (filters.location && filters.location.trim() !== '') {
        const locationTerm = filters.location.toLowerCase();
        results = results.filter(property => 
          property.location.toLowerCase().includes(locationTerm)
        );
        console.log("After location filter:", results.length);
      }
      
      // Filter by property type if specified
      if (filters.propertyType !== 'All Types') {
        results = results.filter(property => 
          property.propertyType === filters.propertyType
        );
        console.log("After property type filter:", results.length);
      }
      
      // Filter by number of bedrooms if specified
      if (filters.bedrooms !== '') {
        if (filters.bedrooms === '5+') {
          results = results.filter(property => property.bedrooms >= 5);
        } else {
          // Convert string bedroom value to number for comparison
          const bedroomCount = parseInt(filters.bedrooms);
          if (!isNaN(bedroomCount)) {
            results = results.filter(property => property.bedrooms === bedroomCount);
          }
        }
        console.log("After bedrooms filter:", results.length);
      }
      
      // Filter by price range
      results = results.filter(property => 
        property.price >= filters.priceRange[0] && 
        property.price <= filters.priceRange[1]
      );
      console.log("After price filter:", results.length);
      
      setFilteredProperties(results);
      setPage(1); // Reset to first page after search
      setIsLoading(false);
    }, 500); // 500ms delay to simulate network request
  };
  
  // Handle page change
  const handleChangePage = (event, value) => {
    setPage(value);
  };
  
  // Calculate pagination
  const indexOfLastProperty = page * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  // Handle reset filters
  const handleResetFilters = () => {
    setIsLoading(true);
    
    // Reset all filters to default values
    const resetFilters = {
      location: '',
      propertyType: 'All Types',
      bedrooms: '',
      priceRange: [1000000, 50000000],
      searchText: ''
    };
    
    setFilters(resetFilters);
    
    // Reset to all properties
    setFilteredProperties(properties);
    setPage(1);
    setIsLoading(false);
  };

  // Initial search when component mounts
  useEffect(() => {
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Box sx={{ pb: isMobile ? 12 : 0 }}>
      {/* Show mobile search filter for mobile devices */}
      {isMobile ? (
        <MobileSearchFilter 
          filters={filters} 
          setFilters={setFilters} 
          onSearch={handleSearch}
          onResetFilters={handleResetFilters} 
        />
      ) : null}
      
      <Container sx={{ py: isMobile ? 2 : 8, pt: isMobile ? 0 : 8 }}>
        {!isMobile && (
          <>
            <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
              Property Listings
            </Typography>
            
            <SearchFilter 
              filters={filters} 
              setFilters={setFilters} 
              onSearch={handleSearch} 
            />
          </>
        )}
        
        {filteredProperties.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <Typography variant="h6" color="text.secondary">
              No properties match your search criteria. Please try different filters.
            </Typography>
          </Box>
        ) : (
          <>
            {!isMobile && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1">
                  Found {filteredProperties.length} properties
                </Typography>
              </Box>
            )}
            
            {isLoading ? (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <Typography variant="body1">Loading properties...</Typography>
              </Box>
            ) : (
              <Grid container spacing={isMobile ? 2 : 4}>
                {currentProperties.map((property) => (
                  <Grid item key={property.id} xs={12} sm={6} md={4}>
                    <PropertyCard property={property} />
                  </Grid>
                ))}
              </Grid>
            )}
            
            {totalPages > 1 && (
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mt: 5,
                mb: isMobile ? 2 : 0
              }}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handleChangePage} 
                  color="primary" 
                  size={isMobile ? "medium" : "large"} 
                  showFirstButton={!isMobile}
                  showLastButton={!isMobile}
                />
              </Box>
            )}
          </>
        )}
      </Container>
      
      {/* Back to top button - only visible on mobile */}
      {isMobile && filteredProperties.length > 3 && (
        <Fab 
          color="primary" 
          size="small" 
          aria-label="scroll back to top"
          onClick={scrollToTop}
          sx={{ position: 'fixed', bottom: 80, right: 16 }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      )}
    </Box>
  );
};

export default ListingsPage; 