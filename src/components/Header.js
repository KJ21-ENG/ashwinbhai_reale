import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Menu,
  MenuItem,
  useScrollTrigger,
  Slide,
  useTheme,
  alpha
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import HomeIcon from '@mui/icons-material/Home';
import { useIsMobile } from '../utils/deviceDetect';

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header = () => {
  const theme = useTheme();
  const isMobile = useIsMobile();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);

  // Navigation items with submenu structure
  const navItems = [
    { name: 'Home', path: '/' },
    { 
      name: 'Properties', 
      path: '/listings',
      submenu: [
        { name: 'All Properties', path: '/listings' },
        { name: 'Apartments', path: '/listings?type=Apartment' },
        { name: 'Houses', path: '/listings?type=House' },
        { name: 'Commercial', path: '/listings?type=Commercial' }
      ]
    },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Admin', path: '/admin' }
  ];

  // Check if page is scrolled
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileSubmenuToggle = () => {
    setMobileSubmenuOpen(!mobileSubmenuOpen);
  };

  const isRouteActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <HideOnScroll>
        <AppBar 
          position="fixed" 
          sx={{
            bgcolor: scrolled ? 'white' : 'transparent',
            boxShadow: scrolled ? 1 : 'none',
            transition: 'all 0.3s ease-in-out',
            backdropFilter: scrolled ? 'blur(10px)' : 'none',
            borderBottom: scrolled ? `1px solid ${alpha(theme.palette.primary.main, 0.1)}` : 'none'
          }}
        >
          <Container>
            <Toolbar disableGutters sx={{ py: scrolled ? 0.5 : 1 }}>
              {/* Logo */}
              <Box 
                component={Link} 
                to="/" 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  flexGrow: 1, 
                  textDecoration: 'none',
                  '&:hover': {
                    opacity: 0.9
                  }
                }}
              >
                <Box 
                  sx={{ 
                    mr: 1, 
                    display: 'flex', 
                    bgcolor: 'primary.main', 
                    color: 'white',
                    p: 0.8,
                    borderRadius: 1
                  }}
                >
                  <HomeIcon />
                </Box>
                <Typography 
                  variant="h6" 
                  component="div" 
                  sx={{ 
                    fontWeight: 'bold',
                    color: scrolled ? 'primary.main' : 'white',
                    textShadow: scrolled ? 'none' : '1px 1px 3px rgba(0,0,0,0.3)'
                  }}
                >
                  Ashwin Real Estate
                </Typography>
              </Box>

              {/* Desktop Navigation */}
              {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {navItems.map((item) => (
                    <Box key={item.name}>
                      {item.submenu ? (
                        // Dropdown menu
                        <Box>
                          <Button
                            color="inherit"
                            aria-controls="property-menu"
                            aria-haspopup="true"
                            onClick={handleMenuOpen}
                            endIcon={<KeyboardArrowDownIcon />}
                            sx={{
                              mx: 1,
                              color: scrolled ? (isRouteActive(item.path) ? 'primary.main' : 'text.primary') : 'white',
                              fontWeight: isRouteActive(item.path) ? 'bold' : 'normal',
                              '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.1)
                              }
                            }}
                          >
                            {item.name}
                          </Button>
                          <Menu
                            id="property-menu"
                            anchorEl={anchorEl}
                            keepMounted
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'center',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'center',
                            }}
                            sx={{
                              '& .MuiPaper-root': {
                                borderRadius: 2,
                                mt: 1.5,
                                boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                                minWidth: 180
                              }
                            }}
                          >
                            {item.submenu.map((subItem) => (
                              <MenuItem 
                                key={subItem.name} 
                                component={Link} 
                                to={subItem.path} 
                                onClick={handleMenuClose}
                                sx={{
                                  py: 1,
                                  '&:hover': {
                                    bgcolor: alpha(theme.palette.primary.main, 0.08),
                                  }
                                }}
                              >
                                {subItem.name}
                              </MenuItem>
                            ))}
                          </Menu>
                        </Box>
                      ) : (
                        // Regular menu item
                        <Button
                          component={Link}
                          to={item.path}
                          sx={{
                            mx: 1,
                            color: scrolled ? (isRouteActive(item.path) ? 'primary.main' : 'text.primary') : 'white',
                            fontWeight: isRouteActive(item.path) ? 'bold' : 'normal',
                            position: 'relative',
                            '&:after': isRouteActive(item.path) ? {
                              content: '""',
                              position: 'absolute',
                              bottom: 0,
                              left: '50%',
                              width: '40%',
                              height: '2px',
                              bgcolor: scrolled ? 'primary.main' : 'white',
                              transform: 'translateX(-50%)'
                            } : {},
                            '&:hover': {
                              bgcolor: 'transparent',
                              '&:after': {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: '50%',
                                width: '20%',
                                height: '2px',
                                bgcolor: scrolled ? 'primary.main' : 'white',
                                transform: 'translateX(-50%)'
                              }
                            }
                          }}
                        >
                          {item.name}
                        </Button>
                      )}
                    </Box>
                  ))}
                  
                  {/* Login/Register buttons */}
                  <Button 
                    variant="outlined" 
                    component={Link} 
                    to="/login"
                    sx={{ 
                      ml: 2,
                      borderColor: scrolled ? 'primary.main' : 'white',
                      color: scrolled ? 'primary.main' : 'white',
                      borderRadius: '20px',
                      px: 2,
                      '&:hover': {
                        borderColor: scrolled ? 'primary.dark' : 'white',
                        bgcolor: alpha(theme.palette.primary.main, 0.08)
                      }
                    }}
                  >
                    Login
                  </Button>
                </Box>
              )}

              {/* Mobile Navigation */}
              {isMobile && (
                <IconButton 
                  edge="end" 
                  color="inherit" 
                  aria-label="menu" 
                  onClick={toggleDrawer(true)}
                  sx={{ color: scrolled ? 'text.primary' : 'white' }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '75%',
            maxWidth: '300px',
            boxSizing: 'border-box',
            pt: 2,
          },
        }}
      >
        <Box
          sx={{ px: 2, pb: 2 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box 
              sx={{ 
                mr: 1, 
                display: 'flex', 
                bgcolor: 'primary.main', 
                color: 'white',
                p: 0.8,
                borderRadius: 1
              }}
            >
              <HomeIcon />
            </Box>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Ashwin Real Estate
            </Typography>
          </Box>
          
          <List>
            {navItems.map((item) => (
              <React.Fragment key={item.name}>
                {item.submenu ? (
                  <>
                    <ListItem button onClick={handleMobileSubmenuToggle}>
                      <ListItemText 
                        primary={item.name} 
                        primaryTypographyProps={{
                          fontWeight: isRouteActive(item.path) ? 'bold' : 'normal',
                          color: isRouteActive(item.path) ? 'primary.main' : 'inherit'
                        }}
                      />
                      {mobileSubmenuOpen ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={mobileSubmenuOpen} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.submenu.map((subItem) => (
                          <ListItem 
                            button 
                            key={subItem.name} 
                            component={Link} 
                            to={subItem.path}
                            sx={{ pl: 4 }}
                          >
                            <ListItemText 
                              primary={subItem.name} 
                              primaryTypographyProps={{
                                fontWeight: location.pathname === subItem.path ? 'bold' : 'normal',
                                color: location.pathname === subItem.path ? 'primary.main' : 'inherit'
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </>
                ) : (
                  <ListItem 
                    button 
                    component={Link} 
                    to={item.path}
                    selected={isRouteActive(item.path)}
                    sx={{
                      '&.Mui-selected': {
                        bgcolor: alpha(theme.palette.primary.main, 0.1)
                      }
                    }}
                  >
                    <ListItemText 
                      primary={item.name} 
                      primaryTypographyProps={{
                        fontWeight: isRouteActive(item.path) ? 'bold' : 'normal',
                        color: isRouteActive(item.path) ? 'primary.main' : 'inherit'
                      }}
                    />
                  </ListItem>
                )}
              </React.Fragment>
            ))}
            <ListItem button component={Link} to="/login">
              <ListItemText primary="Login" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Toolbar for spacing */}
      <Toolbar id="back-to-top-anchor" sx={{ mb: 3 }} />
    </>
  );
};

export default Header; 