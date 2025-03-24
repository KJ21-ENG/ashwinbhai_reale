import React from 'react';
import { Container, Typography, Grid, Box, Paper } from '@mui/material';
import ContactForm from '../components/ContactForm';
import { useIsMobile } from '../utils/deviceDetect';

const ContactPage = () => {
  const isMobile = useIsMobile();
  
  return (
    <Container sx={{ py: isMobile ? 4 : 8, pb: isMobile ? 12 : 8 }}>
      <Typography variant={isMobile ? "h5" : "h4"} component="h1" gutterBottom align="center" sx={{ mb: isMobile ? 3 : 4 }}>
        Contact Us
      </Typography>
      
      {isMobile ? (
        // Mobile Layout
        <>
          <ContactForm />
          
          <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Get in Touch
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                Office Address
              </Typography>
              <Typography variant="body2">
                123 Real Estate Boulevard, <br />
                Ahmedabad, Gujarat 380008
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold">
                Contact Information
              </Typography>
              <Typography variant="body2">
                Phone: +91 9876543210 <br />
                Email: info@ashwinrealestate.com
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" fontWeight="bold">
                Business Hours
              </Typography>
              <Typography variant="body2">
                Monday - Friday: 9:00 AM - 6:00 PM <br />
                Saturday: 10:00 AM - 4:00 PM <br />
                Sunday: Closed
              </Typography>
            </Box>
          </Paper>
        </>
      ) : (
        // Desktop Layout
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <ContactForm />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Get in Touch
              </Typography>
              
              <Typography variant="body1" paragraph>
                Whether you're looking to buy, sell, or simply have questions about the real estate market, our team of experienced professionals is here to help.
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Office Address
                </Typography>
                <Typography variant="body1">
                  123 Real Estate Boulevard, <br />
                  Ahmedabad, Gujarat 380008
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Contact Information
                </Typography>
                <Typography variant="body1">
                  Phone: +91 9876543210 <br />
                  Email: info@ashwinrealestate.com
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Business Hours
                </Typography>
                <Typography variant="body1">
                  Monday - Friday: 9:00 AM - 6:00 PM <br />
                  Saturday: 10:00 AM - 4:00 PM <br />
                  Sunday: Closed
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
      
      {/* Google Maps Placeholder - In a real implementation, this would be a Google Maps component */}
      <Paper elevation={1} sx={{ mt: isMobile ? 4 : 6, p: 2 }}>
        <Box
          sx={{
            width: '100%',
            height: isMobile ? 200 : 300,
            bgcolor: 'grey.200',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Google Maps would be integrated here in the final implementation
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default ContactPage; 