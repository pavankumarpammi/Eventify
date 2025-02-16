import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Send as SendIcon,
} from '@mui/icons-material';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitStatus, setSubmitStatus] = useState({
    success: false,
    error: false,
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    // For now, we'll just show a success message
    setSubmitStatus({
      success: true,
      error: false,
      message: 'Thank you for your message. We will get back to you soon!',
    });
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  const contactInfo = [
    {
      icon: <EmailIcon fontSize="large" color="primary" />,
      title: 'Email',
      content: 'support@eventmanagement.com',
    },
    {
      icon: <PhoneIcon fontSize="large" color="primary" />,
      title: 'Phone',
      content: '+1 (555) 123-4567',
    },
    {
      icon: <LocationIcon fontSize="large" color="primary" />,
      title: 'Address',
      content: '123 Event Street, City, Country',
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box textAlign="center" mb={6}>
          <Typography variant="h3" component="h1" gutterBottom color="primary" fontWeight="bold">
            Contact Us
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            We'd Love to Hear From You
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom color="primary">
              Send Us a Message
            </Typography>
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Your Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="subject"
                label="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="message"
                label="Message"
                name="message"
                multiline
                rows={4}
                value={formData.message}
                onChange={handleChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                endIcon={<SendIcon />}
              >
                Send Message
              </Button>
              {submitStatus.success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {submitStatus.message}
                </Alert>
              )}
              {submitStatus.error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {submitStatus.message}
                </Alert>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom color="primary" mb={3}>
              Contact Information
            </Typography>
            <Grid container spacing={3}>
              {contactInfo.map((info, index) => (
                <Grid item xs={12} key={index}>
                  <Card 
                    sx={{ 
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                      },
                    }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2}>
                        {info.icon}
                        <Box>
                          <Typography variant="h6">
                            {info.title}
                          </Typography>
                          <Typography variant="body1" color="text.secondary">
                            {info.content}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box mt={4}>
              <Typography variant="h5" gutterBottom color="primary">
                Business Hours
              </Typography>
              <Typography variant="body1">
                Monday - Friday: 9:00 AM - 6:00 PM
              </Typography>
              <Typography variant="body1">
                Saturday: 10:00 AM - 4:00 PM
              </Typography>
              <Typography variant="body1">
                Sunday: Closed
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ContactUs; 