import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
} from '@mui/material';
import {
  Event as EventIcon,
  Security as SecurityIcon,
  Support as SupportIcon,
  People as PeopleIcon,
} from '@mui/icons-material';

const AboutUs = () => {
  const features = [
    {
      icon: <EventIcon fontSize="large" color="primary" />,
      title: 'Event Management',
      description: 'Comprehensive tools for creating and managing events of all sizes.',
    },
    {
      icon: <SecurityIcon fontSize="large" color="primary" />,
      title: 'Secure Booking',
      description: 'Safe and secure ticket booking system with multiple payment options.',
    },
    {
      icon: <SupportIcon fontSize="large" color="primary" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your event-related queries.',
    },
    {
      icon: <PeopleIcon fontSize="large" color="primary" />,
      title: 'Community',
      description: 'Join our growing community of event organizers and attendees.',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h1" gutterBottom color="primary" fontWeight="bold">
            About Us
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Your Premier Event Management Platform
          </Typography>
        </Box>

        <Grid container spacing={4} mb={6}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom color="primary">
              Our Mission
            </Typography>
            <Typography variant="body1" paragraph>
              We strive to create the perfect platform where event organizers and attendees can connect seamlessly. 
              Our mission is to make event management and ticket booking as simple and efficient as possible.
            </Typography>
            <Typography variant="body1" paragraph>
              Whether you're organizing a small workshop or a large conference, we provide all the tools 
              you need to create successful events and memorable experiences.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="/assets/about-us.jpg"
              alt="About Us"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: 3,
              }}
            />
          </Grid>
        </Grid>

        <Typography variant="h4" gutterBottom color="primary" textAlign="center" mb={4}>
          What We Offer
        </Typography>
        
        <Grid container spacing={3}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <CardContent>
                  <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                    <Avatar
                      sx={{
                        width: 60,
                        height: 60,
                        bgcolor: 'primary.light',
                        mb: 2,
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Typography variant="h6" gutterBottom>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {feature.description}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box mt={6} textAlign="center">
          <Typography variant="h4" gutterBottom color="primary">
            Our Values
          </Typography>
          <Typography variant="body1" paragraph>
            We believe in transparency, reliability, and exceptional service. Our platform is built on 
            trust and commitment to both event organizers and attendees.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default AboutUs; 