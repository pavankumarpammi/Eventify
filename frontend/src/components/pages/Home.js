import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Button,
  Paper,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import BusinessIcon from '@mui/icons-material/Business';
import CelebrationIcon from '@mui/icons-material/Celebration';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SchoolIcon from '@mui/icons-material/School';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';

const Home = () => {
  const navigate = useNavigate();

  const eventCategories = [
    {
      title: 'Corporate Events',
      description: 'Professional conferences, seminars, and team building events',
      icon: <BusinessIcon sx={{ fontSize: 40 }} />,
      image: '/assets/corporate.jpg'
    },
    {
      title: 'Social Gatherings',
      description: 'Weddings, parties, and social celebrations',
      icon: <CelebrationIcon sx={{ fontSize: 40 }} />,
      image: '/assets/social.jpg'
    },
    {
      title: 'Concerts & Shows',
      description: 'Live music performances, theater shows, and entertainment events',
      icon: <MusicNoteIcon sx={{ fontSize: 40 }} />,
      image: '/assets/concert.jpg'
    },
    {
      title: 'Educational',
      description: 'Workshops, training sessions, and educational seminars',
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      image: '/assets/education.jpg'
    },
    {
      title: 'Sports & Fitness',
      description: 'Sports tournaments, fitness classes, and athletic events',
      icon: <SportsBasketballIcon sx={{ fontSize: 40 }} />,
      image: '/assets/sports.jpg'
    },
    {
      title: 'Special Events',
      description: 'Exhibitions, trade shows, and special occasions',
      icon: <EventIcon sx={{ fontSize: 40 }} />,
      image: '/assets/special.jpg'
    }
  ];

  const features = [
    {
      title: 'Easy Booking',
      description: 'Simple and secure ticket booking process',
      color: '#1A237E'
    },
    {
      title: 'Event Management',
      description: 'Comprehensive tools for event organizers',
      color: '#AD1457'
    },
    {
      title: 'Instant Tickets',
      description: 'Get your tickets instantly with QR codes',
      color: '#2E7D32'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(26,35,126,0.95) 0%, rgba(173,20,87,0.8) 100%)',
            zIndex: 1,
          },
        }}
      >
        {/* Dynamic Background */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0,
          }}
        >
          <Box
            component="img"
            src="/assets/events.jpeg"
            alt="Events"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              animation: 'kenburns 20s infinite',
              '@keyframes kenburns': {
                '0%': {
                  transform: 'scale(1) translate(0, 0)',
                  filter: 'brightness(1)',
                },
                '50%': {
                  transform: 'scale(1.2) translate(-2%, -2%)',
                  filter: 'brightness(1.1)',
                },
                '100%': {
                  transform: 'scale(1) translate(0, 0)',
                  filter: 'brightness(1)',
                },
              },
            }}
          />
        </Box>

        {/* Content */}
        <Container
          maxWidth="xl"
          sx={{
            position: 'relative',
            zIndex: 2,
            pt: { xs: 4, md: 0 },
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12}>
              <Box
                sx={{
                  position: 'relative',
                  animation: 'slideUp 1s ease-out',
                  '@keyframes slideUp': {
                    from: { transform: 'translateY(50px)', opacity: 0 },
                    to: { transform: 'translateY(0)', opacity: 1 },
                  },
                  textAlign: 'center',
                  maxWidth: '800px',
                  margin: '0 auto'
                }}
              >
                <Typography
                  component="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '5rem' },
                    fontWeight: 900,
                    color: 'white',
                    textTransform: 'uppercase',
                    lineHeight: 1.1,
                    mb: 2,
                    position: 'relative',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      bottom: -10,
                      width: '120px',
                      height: '4px',
                      background: 'linear-gradient(90deg, #AD1457, #1A237E)',
                    },
                  }}
                >
                  Experience<br />
                  <Box
                    component="span"
                    sx={{
                      color: '#fff',
                      display: 'inline-block',
                      position: 'relative',
                    }}
                  >
                    Amazing Events
                  </Box>
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    maxWidth: 800,
                    mb: 4,
                    fontWeight: 300,
                    lineHeight: 1.6,
                    textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                    animation: 'fadeIn 1s ease-out 0.5s both',
                    margin: '0 auto',
                    '@keyframes fadeIn': {
                      from: { opacity: 0, transform: 'translateY(20px)' },
                      to: { opacity: 1, transform: 'translateY(0)' },
                    },
                  }}
                >
                  Discover and create extraordinary events that leave lasting impressions. 
                  Your journey to unforgettable experiences starts here.
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    gap: 3,
                    animation: 'fadeIn 1s ease-out 0.8s both',
                    justifyContent: 'center'
                  }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/events')}
                    sx={{
                      py: 2,
                      px: 6,
                      borderRadius: '50px',
                      background: 'linear-gradient(45deg, #1A237E 30%, #AD1457 90%)',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: '0 8px 20px rgba(26,35,126,0.3)',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 12px 25px rgba(26,35,126,0.4)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Explore Events
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/register')}
                    sx={{
                      py: 2,
                      px: 6,
                      borderRadius: '50px',
                      borderColor: 'rgba(255,255,255,0.5)',
                      borderWidth: '2px',
                      color: 'white',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: '#AD1457',
                        color: '#fff',
                        backgroundColor: 'rgba(173,20,87,0.1)',
                        transform: 'translateY(-3px)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    Get Started
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Event Categories */}
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <Typography variant="h3" align="center" gutterBottom sx={{ color: '#1A237E' }}>
          Event Categories
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          Discover the perfect event for every occasion
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {eventCategories.map((category, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 25px rgba(26,35,126,0.2)',
                  },
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid rgba(26,35,126,0.1)',
                }}
              >
                <Box 
                  sx={{ 
                    p: 3, 
                    display: 'flex', 
                    justifyContent: 'center', 
                    background: 'linear-gradient(135deg, #1A237E 0%, #AD1457 100%)',
                    color: 'white'
                  }}
                >
                  {category.icon}
                </Box>
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography gutterBottom variant="h5" component="h2" sx={{ color: '#1A237E' }}>
                    {category.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {category.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ 
        py: 8, 
        background: 'linear-gradient(135deg, rgba(26,35,126,0.05) 0%, rgba(173,20,87,0.05) 100%)',
        borderTop: '1px solid rgba(26,35,126,0.1)',
        borderBottom: '1px solid rgba(26,35,126,0.1)'
      }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{ color: '#1A237E' }}>
            Why Choose Us
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph>
            Experience the best in event management
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 25px rgba(26,35,126,0.2)',
                    },
                    borderRadius: '16px',
                    overflow: 'hidden',
                    background: 'white',
                    border: '1px solid rgba(26,35,126,0.1)',
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Typography gutterBottom variant="h5" component="h2" sx={{ color: '#1A237E', mb: 2 }}>
                      {feature.title}
                    </Typography>
                    <Typography color="text.secondary">
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Call to Action */}
      <Box sx={{ 
        py: 8, 
        background: 'linear-gradient(135deg, #1A237E 0%, #AD1457 100%)',
        color: 'white' 
      }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" align="center" paragraph sx={{ opacity: 0.9 }}>
            Join us today and experience the difference
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/events')}
              sx={{
                py: 2,
                px: 6,
                borderRadius: '50px',
                backgroundColor: 'white',
                color: '#1A237E',
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  transform: 'translateY(-3px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Browse Events
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/register')}
              sx={{
                py: 2,
                px: 6,
                borderRadius: '50px',
                borderColor: 'rgba(255,255,255,0.5)',
                borderWidth: '2px',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-3px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Create Account
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 