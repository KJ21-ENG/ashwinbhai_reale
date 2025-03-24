import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Typography,
  Box
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const PropertyDeleteDialog = ({ open, onClose, onConfirm, property }) => {
  if (!property) return null;
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningIcon color="error" />
          <Typography variant="h6">Delete Property</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete <strong>{property.title}</strong>? 
          This action cannot be undone and all associated data will be permanently removed.
        </DialogContentText>
        
        <Box sx={{ mt: 2, p: 2, bgcolor: '#f8f8f8', borderRadius: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">Property Details:</Typography>
          <Typography variant="body2"><strong>ID:</strong> {property.id}</Typography>
          <Typography variant="body2"><strong>Location:</strong> {property.location}</Typography>
          <Typography variant="body2"><strong>Price:</strong> ₹{property.price?.toLocaleString()}</Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={() => onConfirm(property.id)} 
          color="error" 
          variant="contained"
          autoFocus
        >
          Delete Property
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PropertyDeleteDialog; 