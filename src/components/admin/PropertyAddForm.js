import React, { useState, useRef } from 'react';
import { 
  Box, Grid, TextField, MenuItem, Button, Typography, 
  Chip, IconButton, Paper, FormHelperText, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const PropertyAddForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    propertyType: 'Residential',
    size: '',
    bedrooms: '',
    bathrooms: '',
    images: [],
    description: '',
    features: []
  });
  
  const [newImage, setNewImage] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  // Property types for dropdown
  const propertyTypes = [
    'Residential',
    'Commercial'
  ];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Convert price to number if it's a price field
    if (name === 'price' || name === 'bedrooms' || name === 'bathrooms') {
      setFormData({
        ...formData,
        [name]: value === '' ? '' : Number(value)
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const addImage = () => {
    if (!newImage.trim()) return;
    
    // Basic URL validation
    const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))/i;
    if (!urlPattern.test(newImage)) {
      setErrors({
        ...errors,
        images: 'Please enter a valid image URL (must end with an image extension)'
      });
      return;
    }
    
    setFormData({
      ...formData,
      images: [...formData.images, newImage.trim()]
    });
    setNewImage('');
    
    // Clear error when images are added
    if (errors.images) {
      setErrors({
        ...errors,
        images: ''
      });
    }
  };
  
  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Process each file
    Array.from(files).forEach(file => {
      // Create a local URL for the image
      const imageUrl = URL.createObjectURL(file);
      
      setFormData(prevData => ({
        ...prevData,
        images: [...prevData.images, imageUrl]
      }));
    });
    
    // Clear any image errors
    if (errors.images) {
      setErrors({
        ...errors,
        images: ''
      });
    }
    
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };
  
  const removeImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    setFormData({
      ...formData,
      images: updatedImages
    });
  };
  
  const addFeature = () => {
    if (!newFeature.trim()) return;
    
    setFormData({
      ...formData,
      features: [...formData.features, newFeature.trim()]
    });
    setNewFeature('');
  };
  
  const removeFeature = (index) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);
    setFormData({
      ...formData,
      features: updatedFeatures
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.propertyType) newErrors.propertyType = 'Property type is required';
    if (!formData.size.trim()) newErrors.size = 'Size is required';
    if (formData.images.length === 0) newErrors.images = 'At least one image is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Grid container spacing={3}>
        {/* Basic Information */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Basic Information</Typography>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Property Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            error={!!errors.location}
            helperText={errors.location}
            placeholder="e.g. Ahmedabad, Gujarat"
          />
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Property Type"
            name="propertyType"
            select
            value={formData.propertyType}
            onChange={handleChange}
            error={!!errors.propertyType}
            helperText={errors.propertyType}
          >
            {propertyTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Price (₹)"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            error={!!errors.price}
            helperText={errors.price}
            inputProps={{ min: 0 }}
          />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <TextField
            required
            fullWidth
            label="Size (e.g. 1200 sq.ft)"
            name="size"
            value={formData.size}
            onChange={handleChange}
            error={!!errors.size}
            helperText={errors.size}
          />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Bedrooms"
            name="bedrooms"
            type="number"
            value={formData.bedrooms}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
        </Grid>
        
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Bathrooms"
            name="bathrooms"
            type="number"
            value={formData.bathrooms}
            onChange={handleChange}
            inputProps={{ min: 0 }}
          />
        </Grid>
        
        {/* Description */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Description</Typography>
          <TextField
            required
            fullWidth
            multiline
            rows={4}
            label="Property Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            error={!!errors.description}
            helperText={errors.description}
          />
        </Grid>
        
        {/* Images */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Images</Typography>
          
          {/* Image upload from device */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Upload from device:</Typography>
            <Button 
              variant="outlined" 
              startIcon={<AddPhotoAlternateIcon />}
              onClick={() => fileInputRef.current.click()}
              sx={{ mr: 2 }}
            >
              Choose Images
            </Button>
            <input 
              type="file" 
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              multiple
              onChange={handleFileUpload}
            />
          </Box>
          
          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">OR</Typography>
          </Divider>
          
          {/* Image URL input */}
          <Typography variant="subtitle2" gutterBottom>Add by URL:</Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <TextField
              fullWidth
              label="Image URL"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
              error={!!errors.images}
              placeholder="https://example.com/image.jpg"
            />
            <Button 
              variant="contained"
              onClick={addImage}
              sx={{ ml: 1, mt: 1 }}
            >
              Add
            </Button>
          </Box>
          {errors.images && (
            <FormHelperText error>{errors.images}</FormHelperText>
          )}
          
          {formData.images.length > 0 && (
            <Paper sx={{ p: 2, mt: 2, maxHeight: 300, overflow: 'auto' }}>
              <Grid container spacing={1}>
                {formData.images.map((image, index) => (
                  <Grid item xs={6} sm={4} md={3} key={index}>
                    <Box sx={{ position: 'relative' }}>
                      <Box
                        component="img"
                        src={image}
                        alt={`Property Image ${index + 1}`}
                        sx={{ 
                          width: '100%', 
                          height: 100, 
                          objectFit: 'cover',
                          borderRadius: 1 
                        }}
                      />
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => removeImage(index)}
                        sx={{ 
                          position: 'absolute', 
                          top: 0, 
                          right: 0,
                          bgcolor: 'rgba(255,255,255,0.7)',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.9)',
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          )}
        </Grid>
        
        {/* Features */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>Features</Typography>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
            <TextField
              fullWidth
              label="Feature"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="e.g. Swimming Pool, Gym, etc."
            />
            <Button 
              variant="contained"
              onClick={addFeature}
              sx={{ ml: 1, mt: 1 }}
            >
              Add
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formData.features.map((feature, index) => (
              <Chip
                key={index}
                label={feature}
                onDelete={() => removeFeature(index)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Grid>
        
        {/* Submit Button */}
        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ mt: 2 }}
          >
            Add Property
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PropertyAddForm; 