import React, { useState, useEffect } from 'react';
import {
  Container, Grid, Paper, Typography, Box, Button, Tabs, Tab, Snackbar, Alert,
  TextField, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogActions, DialogContent, DialogTitle, Chip, IconButton
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PropertyAddForm from '../components/admin/PropertyAddForm';
import PropertyEditForm from '../components/admin/PropertyEditForm';
import PropertyDeleteDialog from '../components/admin/PropertyDeleteDialog';
import { getAllProperties, addProperty, updateProperty, deleteProperty } from '../services/propertyService';

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
    backgroundColor: theme.palette.grey[100],
  }
}));

const AdminDashboard = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [allProperties, setAllProperties] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    // Load properties from service
    const properties = getAllProperties();
    setAllProperties(properties);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddProperty = (newProperty) => {
    // Call the service to add a property
    const addedProperty = addProperty(newProperty);
    
    // Update the local state
    setAllProperties([...allProperties, addedProperty]);
    
    setOpenAddDialog(false);
    setSnackbar({
      open: true,
      message: 'Property added successfully',
      severity: 'success'
    });
  };

  const handleEditProperty = (updatedProperty) => {
    // Call the service to update a property
    const result = updateProperty(updatedProperty.id, updatedProperty);
    
    if (result) {
      // Update the local state
      const updatedProperties = allProperties.map(property => 
        property.id === updatedProperty.id ? updatedProperty : property
      );
      
      setAllProperties(updatedProperties);
      
      setOpenEditDialog(false);
      setSnackbar({
        open: true,
        message: 'Property updated successfully',
        severity: 'success'
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Error updating property',
        severity: 'error'
      });
    }
  };

  const handleDeleteProperty = (propertyId) => {
    // Call the service to delete a property
    const success = deleteProperty(propertyId);
    
    if (success) {
      // Update the local state
      const updatedProperties = allProperties.filter(property => property.id !== propertyId);
      setAllProperties(updatedProperties);
      
      setOpenDeleteDialog(false);
      setSnackbar({
        open: true,
        message: 'Property deleted successfully',
        severity: 'warning'
      });
    } else {
      setSnackbar({
        open: true,
        message: 'Error deleting property',
        severity: 'error'
      });
    }
  };

  const openPropertyEdit = (property) => {
    setSelectedProperty(property);
    setOpenEditDialog(true);
  };

  const openPropertyDelete = (property) => {
    setSelectedProperty(property);
    setOpenDeleteDialog(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Grid container spacing={3}>
        {/* Dashboard Header */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h4" component="h1">Admin Dashboard</Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => setOpenAddDialog(true)}
            >
              Add Property
            </Button>
          </Paper>
        </Grid>

        {/* Dashboard Tabs */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Tabs value={tabValue} onChange={handleTabChange} centered>
              <Tab label="All Properties" />
              <Tab label="Residential" />
              <Tab label="Commercial" />
            </Tabs>
          </Paper>
        </Grid>

        {/* Properties Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Image</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {allProperties
                    .filter(property => {
                      if (tabValue === 0) return true;
                      if (tabValue === 1) return property.propertyType === 'Residential';
                      if (tabValue === 2) return property.propertyType === 'Commercial';
                      return true;
                    })
                    .map((property) => (
                      <StyledTableRow key={property.id}>
                        <TableCell>{property.id}</TableCell>
                        <TableCell>
                          <Box 
                            component="img" 
                            src={property.images && property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/150'}
                            alt={property.title}
                            sx={{ width: 100, height: 60, objectFit: 'cover', borderRadius: 1 }}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/150';
                            }}
                          />
                        </TableCell>
                        <TableCell>{property.title}</TableCell>
                        <TableCell>{property.location}</TableCell>
                        <TableCell>
                          <Chip 
                            label={property.propertyType} 
                            color="primary" 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>{formatPrice(property.price)}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                              size="small" 
                              color="primary"
                              href={`/property/${property.id}`} 
                              target="_blank"
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="warning"
                              onClick={() => openPropertyEdit(property)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton 
                              size="small" 
                              color="error"
                              onClick={() => openPropertyDelete(property)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Add Property Dialog */}
      <Dialog 
        open={openAddDialog} 
        onClose={() => setOpenAddDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Add New Property</DialogTitle>
        <DialogContent>
          <PropertyAddForm onSubmit={handleAddProperty} />
        </DialogContent>
      </Dialog>
      
      {/* Edit Property Dialog */}
      <Dialog 
        open={openEditDialog} 
        onClose={() => setOpenEditDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Edit Property</DialogTitle>
        <DialogContent>
          {selectedProperty && (
            <PropertyEditForm 
              property={selectedProperty} 
              onSubmit={handleEditProperty} 
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Property Dialog */}
      <PropertyDeleteDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteProperty}
        property={selectedProperty}
      />
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminDashboard; 