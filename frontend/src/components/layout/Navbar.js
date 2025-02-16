import React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Badge,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from '@mui/icons-material/Category';
import HelpIcon from '@mui/icons-material/Help';
import InfoIcon from '@mui/icons-material/Info';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import { logout } from '../../store/slices/authSlice';
import {
  Dashboard as DashboardIcon,
  ConfirmationNumber as TicketIcon,
  Bookmark as SavedIcon,
  Notifications as NotificationsMenuIcon,
  Settings as SettingsIcon,
  ExitToApp as LogoutIcon,
  AdminPanelSettings as AdminIcon,
  EventNote as EventIcon,
  Analytics as AnalyticsIcon,
  Assignment as RequestsIcon,
  Person as ProfileIcon,
} from '@mui/icons-material';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const pages = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Request Event', path: '/request-event', icon: <RequestsIcon /> },
    { name: 'About Us', path: '/about', icon: <InfoIcon /> },
    { name: 'Contact Us', path: '/contact', icon: <ContactSupportIcon /> },
  ];

  const getSettingsMenu = () => {
    const settings = [
      { title: 'Profile', path: '/dashboard', icon: <ProfileIcon /> },
      { title: 'My Tickets', path: '/dashboard?tab=tickets', icon: <TicketIcon /> },
      { title: 'Saved Events', path: '/dashboard?tab=saved', icon: <SavedIcon /> },
      { title: 'Notifications', path: '/dashboard?tab=notifications', icon: <NotificationsMenuIcon /> },
    ];

    if (user?.role === 'organizer') {
      settings.push(
        { title: 'Organizer Dashboard', path: '/organizer/dashboard', icon: <DashboardIcon /> },
        { title: 'Create Event', path: '/organizer/create-event', icon: <EventIcon /> },
        { title: 'Event Analytics', path: '/organizer/analytics', icon: <AnalyticsIcon /> },
        { title: 'Custom Requests', path: '/organizer/requests', icon: <RequestsIcon /> }
      );
    }

    if (user?.role === 'admin') {
      settings.push(
        { title: 'Admin Dashboard', path: '/admin/dashboard', icon: <AdminIcon /> },
        { title: 'User Management', path: '/admin/users', icon: <ProfileIcon /> },
        { title: 'Event Management', path: '/admin/events', icon: <EventIcon /> },
        { title: 'Analytics', path: '/admin/analytics', icon: <AnalyticsIcon /> }
      );
    }

    settings.push(
      { title: 'Settings', path: '/settings', icon: <SettingsIcon /> },
      { title: 'Logout', onClick: handleLogout, icon: <LogoutIcon />, divider: true }
    );

    return settings;
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'linear-gradient(135deg, #1A237E 0%, #AD1457 100%)',
        height: '60px',
        display: 'flex',
        justifyContent: 'center',
        boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
        '@keyframes fadeIn': {
          '0%': {
            opacity: 0,
            transform: 'translateY(-10px)',
          },
          '100%': {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
        animation: 'fadeIn 0.5s ease-out',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: '60px !important' }}>
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 900,
              letterSpacing: '.3rem',
              color: 'white',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px) scale(1.02)',
                textShadow: '0 4px 8px rgba(0,0,0,0.2)',
              },
            }}
          >
            EVENTIFY
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="small"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ 
                color: 'white',
                transition: 'transform 0.2s ease',
                '&:hover': {
                  transform: 'rotate(180deg)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiPaper-root': {
                  borderRadius: '12px',
                  mt: 1,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  animation: 'slideIn 0.3s ease-out',
                  '@keyframes slideIn': {
                    '0%': {
                      opacity: 0,
                      transform: 'translateY(-10px)',
                    },
                    '100%': {
                      opacity: 1,
                      transform: 'translateY(0)',
                    },
                  },
                },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={handleCloseNavMenu}
                  component={RouterLink}
                  to={page.path}
                  sx={{
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(173,20,87,0.08)',
                      transform: 'translateX(5px)',
                    },
                  }}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 900,
              letterSpacing: '.3rem',
              color: 'white',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-2px) scale(1.02)',
                textShadow: '0 4px 8px rgba(0,0,0,0.2)',
              },
            }}
          >
            EVENTIFY
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={RouterLink}
                to={page.path}
                onClick={handleCloseNavMenu}
                startIcon={page.icon}
                sx={{
                  my: 1,
                  mx: 1,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  fontWeight: 600,
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: '0%',
                    height: '2px',
                    bottom: '5px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: 'white',
                    transition: 'width 0.3s ease',
                  },
                  '&:hover': {
                    backgroundColor: 'transparent',
                    transform: 'translateY(-2px)',
                    '&::after': {
                      width: '80%',
                    },
                  },
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
            {user && (
              <Tooltip title="Notifications">
                <IconButton
                  size="large"
                  color="inherit"
                  sx={{
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}

            <Box sx={{ flexGrow: 0 }}>
              {user ? (
                <>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar 
                        alt={user.name} 
                        src="/static/images/avatar/2.jpg"
                        sx={{
                          width: 35,
                          height: 35,
                          border: '2px solid rgba(255,255,255,0.8)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.1) rotate(5deg)',
                            boxShadow: '0 0 10px rgba(255,255,255,0.5)',
                          },
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{
                      mt: '45px',
                      '& .MuiPaper-root': {
                        borderRadius: '12px',
                        minWidth: '250px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        animation: 'slideIn 0.3s ease-out',
                        '@keyframes slideIn': {
                          '0%': {
                            opacity: 0,
                            transform: 'translateY(-10px)',
                          },
                          '100%': {
                            opacity: 1,
                            transform: 'translateY(0)',
                          },
                        },
                      },
                    }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {user?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user?.email}
                      </Typography>
                    </Box>
                    {getSettingsMenu().map((setting, index) => (
                      <React.Fragment key={setting.title}>
                        {setting.divider && index > 0 && (
                          <Divider sx={{ my: 1 }} />
                        )}
                        <MenuItem
                          onClick={() => {
                            handleCloseUserMenu();
                            if (setting.onClick) {
                              setting.onClick();
                            } else {
                              navigate(setting.path);
                            }
                          }}
                          sx={{
                            px: 2,
                            py: 1.5,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              backgroundColor: 'rgba(173,20,87,0.08)',
                              transform: 'translateX(5px)',
                            },
                          }}
                        >
                          <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            gap: 2,
                            color: setting.title === 'Logout' ? '#d32f2f' : 'inherit'
                          }}>
                            {setting.icon}
                            <Typography>{setting.title}</Typography>
                          </Box>
                        </MenuItem>
                      </React.Fragment>
                    ))}
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    sx={{
                      color: 'white',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    sx={{
                      bgcolor: 'white',
                      color: '#1A237E',
                      fontWeight: 600,
                      borderRadius: '50px',
                      px: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.9)',
                        transform: 'translateY(-2px) scale(1.05)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                      },
                    }}
                  >
                    Register
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 