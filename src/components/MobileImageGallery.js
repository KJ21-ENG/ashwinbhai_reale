import React, { useState } from 'react';
import { Box, Dialog, IconButton, MobileStepper, Button, Fade, Grow } from '@mui/material';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import SwipeableViews from 'react-swipeable-views';

const MobileImageGallery = ({ images, title }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const maxSteps = images.length;
  
  // Handle next image
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    // Reset zoom level when changing images
    setZoomLevel(1);
  };
  
  // Handle previous image
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    // Reset zoom level when changing images
    setZoomLevel(1);
  };
  
  // Handle step change from swipe
  const handleStepChange = (step) => {
    setActiveStep(step);
    // Reset zoom level when changing images
    setZoomLevel(1);
  };
  
  // Open fullscreen gallery
  const openFullscreen = () => {
    setFullscreenOpen(true);
  };
  
  // Close fullscreen gallery
  const closeFullscreen = () => {
    setFullscreenOpen(false);
    setZoomLevel(1);
  };
  
  // Handle zoom in
  const zoomIn = (e) => {
    e.stopPropagation();
    if (zoomLevel < 3) {
      setZoomLevel(prevZoom => prevZoom + 0.5);
    }
  };
  
  // Handle zoom out
  const zoomOut = (e) => {
    e.stopPropagation();
    if (zoomLevel > 1) {
      setZoomLevel(prevZoom => prevZoom - 0.5);
    }
  };
  
  // Handle start drag
  const handleTouchStart = () => {
    if (zoomLevel > 1) {
      setIsDragging(true);
    }
  };
  
  // Handle end drag
  const handleTouchEnd = () => {
    setIsDragging(false);
  };
  
  return (
    <>
      {/* Main Gallery */}
      <Box sx={{ 
        position: 'relative', 
        width: '100%', 
        height: 300,
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}>
        <SwipeableViews
          axis="x"
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
          resistance
          springConfig={{ duration: '0.6s', easeFunction: 'cubic-bezier(0.15, 0.3, 0.25, 1)', delay: '0s' }}
        >
          {images.map((image, index) => (
            <Box
              key={index}
              sx={{ 
                height: 300,
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                alignItems: 'flex-end',
                position: 'relative',
                transition: 'transform 0.3s ease',
              }}
            >
              {index === 0 && images.length > 1 && (
                <Grow in={true} timeout={1000}>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '50%',
                      right: 10,
                      transform: 'translateY(-50%)',
                      color: 'white',
                      bgcolor: 'rgba(0,0,0,0.3)',
                      borderRadius: '4px',
                      px: 1,
                      py: 0.5,
                      fontSize: '0.7rem',
                      backdropFilter: 'blur(2px)',
                      display: { xs: 'block', sm: 'none' }
                    }}
                  >
                    Swipe for more
                  </Box>
                </Grow>
              )}
            </Box>
          ))}
        </SwipeableViews>
        
        {/* Fullscreen button */}
        <Fade in={true} timeout={1000}>
          <IconButton
            sx={{
              position: 'absolute',
              bottom: 50,
              right: 8,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                bgcolor: 'rgba(0, 0, 0, 0.7)',
              },
              transition: 'all 0.3s ease',
              backdropFilter: 'blur(2px)',
            }}
            onClick={openFullscreen}
          >
            <FullscreenIcon />
          </IconButton>
        </Fade>
        
        {/* Image stepper */}
        <MobileStepper
          steps={maxSteps}
          position="static"
          activeStep={activeStep}
          sx={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)',
          }}
          nextButton={
            <Button 
              size="small" 
              onClick={handleNext} 
              disabled={activeStep === maxSteps - 1}
              sx={{ color: 'white' }}
            >
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button 
              size="small" 
              onClick={handleBack} 
              disabled={activeStep === 0}
              sx={{ color: 'white' }}
            >
              <KeyboardArrowLeft />
            </Button>
          }
        />
      </Box>
      
      {/* Fullscreen Gallery Dialog */}
      <Dialog
        fullScreen
        open={fullscreenOpen}
        onClose={closeFullscreen}
        TransitionComponent={Fade}
        transitionDuration={300}
      >
        <Box sx={{ bgcolor: 'black', height: '100%', position: 'relative', overflow: 'hidden' }}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              display: 'flex',
              justifyContent: 'space-between',
              p: 1,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(5px)',
            }}
          >
            <IconButton
              sx={{ color: 'white' }}
              onClick={closeFullscreen}
            >
              <CloseIcon />
            </IconButton>
            
            <Box>
              <IconButton
                sx={{ color: 'white' }}
                onClick={zoomOut}
                disabled={zoomLevel <= 1}
              >
                <ZoomOutIcon />
              </IconButton>
              <IconButton
                sx={{ color: 'white' }}
                onClick={zoomIn}
                disabled={zoomLevel >= 3}
              >
                <ZoomInIcon />
              </IconButton>
            </Box>
          </Box>
          
          <SwipeableViews
            axis="x"
            index={activeStep}
            onChangeIndex={handleStepChange}
            enableMouseEvents
            resistance
            disabled={zoomLevel > 1}
            style={{ height: '100%' }}
            springConfig={{ duration: '0.6s', easeFunction: 'cubic-bezier(0.15, 0.3, 0.25, 1)', delay: '0s' }}
          >
            {images.map((image, index) => (
              <Box
                key={index}
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  touchAction: zoomLevel > 1 ? 'pan-x pan-y' : 'auto',
                }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <Box
                  sx={{
                    transition: isDragging ? 'none' : 'transform 0.3s ease',
                    transform: `scale(${zoomLevel})`,
                    maxWidth: '100%',
                    maxHeight: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <img
                    src={image}
                    alt={`${title} - Image ${index + 1}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                </Box>
              </Box>
            ))}
          </SwipeableViews>
          
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {zoomLevel === 1 && (
              <Box sx={{ 
                width: '100%', 
                textAlign: 'center', 
                py: 0.5, 
                bgcolor: 'rgba(0,0,0,0.3)', 
                backdropFilter: 'blur(5px)',
                color: 'white',
                fontSize: '0.8rem'
              }}>
                Pinch to zoom
              </Box>
            )}
            
            <MobileStepper
              steps={maxSteps}
              position="static"
              activeStep={activeStep}
              sx={{
                position: 'relative',
                width: '100%',
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(5px)',
                display: zoomLevel > 1 ? 'none' : 'flex',
              }}
              nextButton={
                <Button 
                  size="small" 
                  onClick={handleNext} 
                  disabled={activeStep === maxSteps - 1}
                  sx={{ color: 'white' }}
                >
                  <KeyboardArrowRight />
                </Button>
              }
              backButton={
                <Button 
                  size="small" 
                  onClick={handleBack} 
                  disabled={activeStep === 0}
                  sx={{ color: 'white' }}
                >
                  <KeyboardArrowLeft />
                </Button>
              }
            />
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default MobileImageGallery; 