import React, { useState, useEffect } from 'react';
import { Paper, BottomNavigation, BottomNavigationAction, Box, Zoom } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';
import FavoriteIcon from '@mui/icons-material/Favorite';

const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  
  // Track scroll direction to hide/show the bottom navigation
  useEffect(() => {
    const handleScroll = () => {
      const st = window.pageYOffset || document.documentElement.scrollTop;
      if (st > lastScrollTop && st > 100) {
        // Scrolling down
        setIsScrollingUp(false);
      } else {
        // Scrolling up
        setIsScrollingUp(true);
      }
      setLastScrollTop(st <= 0 ? 0 : st);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollTop]);
  
  // Get the current path to highlight the active tab
  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/') setValue(0);
    else if (path === '/listings') setValue(1);
    else if (path.includes('/favorites')) setValue(2);
    else if (path === '/contact') setValue(3);
    else setValue(0); // Default to home
  }, [location.pathname]);
  
  const handleNavChange = (event, newValue) => {
    setValue(newValue);
    
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/listings');
        break;
      case 2:
        navigate('/favorites');
        break;
      case 3:
        navigate('/contact');
        break;
      default:
        navigate('/');
    }
  };
  
  return (
    <Zoom in={isScrollingUp}>
      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0, 
          zIndex: 1000,
          borderTop: '1px solid rgba(0,0,0,0.1)',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
          borderRadius: '16px 16px 0 0',
          mx: 0,
          overflow: 'hidden',
        }} 
        elevation={4}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={handleNavChange}
          sx={{ 
            height: 65,
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              padding: '6px 0',
              transition: 'all 0.3s',
            },
            '& .Mui-selected': {
              color: 'primary.main',
              '& .MuiBottomNavigationAction-label': {
                fontSize: '0.75rem',
                fontWeight: 'bold',
                transition: 'font-size 0.2s, opacity 0.2s',
              },
              '& .MuiSvgIcon-root': {
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: 'translateY(-5px) scale(1.1)',
              }
            }
          }}
        >
          {[
            { label: 'Home', icon: <HomeIcon /> },
            { label: 'Search', icon: <SearchIcon /> },
            { label: 'Favorites', icon: <FavoriteIcon /> },
            { label: 'Contact', icon: <PhoneIcon /> }
          ].map((item, index) => (
            <BottomNavigationAction 
              key={index} 
              label={item.label} 
              icon={
                <Box sx={{ 
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: 24
                }}>
                  {value === index && (
                    <Box
                      sx={{
                        position: 'absolute',
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        backgroundColor: 'rgba(46, 125, 50, 0.1)',
                        animation: 'ripple 1.5s infinite ease-in-out',
                        '@keyframes ripple': {
                          '0%': {
                            transform: 'scale(0.8)',
                            opacity: 1,
                          },
                          '100%': {
                            transform: 'scale(1.5)',
                            opacity: 0,
                          },
                        },
                      }}
                    />
                  )}
                  {item.icon}
                </Box>
              } 
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Zoom>
  );
};

export default MobileBottomNav; 