import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createEventRequest } from '../../store/slices/eventRequestSlice';

const CreateEventRequest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.eventRequests);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    expectedDate: null,
    expectedBudget: '',
    attendees: '',
    requirements: ''
  });

  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.expectedDate) errors.expectedDate = 'Expected date is required';
    if (!formData.expectedBudget) errors.expectedBudget = 'Budget is required';
    if (isNaN(formData.expectedBudget) || Number(formData.expectedBudget) <= 0) {
      errors.expectedBudget = 'Please enter a valid budget amount';
    }
    if (!formData.attendees) errors.attendees = 'Number of attendees is required';
    if (isNaN(formData.attendees) || Number(formData.attendees) <= 0) {
      errors.attendees = 'Please enter a valid number of attendees';
    }
    if (!formData.requirements.trim()) errors.requirements = 'Requirements are required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const formattedData = {
          ...formData,
          expectedBudget: Number(formData.expectedBudget),
          attendees: Number(formData.attendees),
          expectedDate: formData.expectedDate.toISOString()
        };

        await dispatch(createEventRequest(formattedData)).unwrap();
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to create request:', err);
        setFormErrors(prev => ({
          ...prev,
          submit: err.message || 'Failed to submit request. Please try again.'
        }));
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom color="primary" fontWeight="bold">
          Request Custom Event
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Event Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={!!formErrors.title}
                helperText={formErrors.title}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Event Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={!!formErrors.description}
                helperText={formErrors.description}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <DatePicker
                label="Expected Date"
                value={formData.expectedDate}
                onChange={(date) => {
                  setFormData(prev => ({ ...prev, expectedDate: date }));
                  if (formErrors.expectedDate) {
                    setFormErrors(prev => ({ ...prev, expectedDate: '' }));
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    fullWidth
                    error={!!formErrors.expectedDate}
                    helperText={formErrors.expectedDate}
                  />
                )}
                minDate={new Date()}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Expected Budget ($)"
                name="expectedBudget"
                type="number"
                value={formData.expectedBudget}
                onChange={handleChange}
                error={!!formErrors.expectedBudget}
                helperText={formErrors.expectedBudget}
                inputProps={{ min: 0 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                required
                fullWidth
                label="Expected Number of Attendees"
                name="attendees"
                type="number"
                value={formData.attendees}
                onChange={handleChange}
                error={!!formErrors.attendees}
                helperText={formErrors.attendees}
                inputProps={{ min: 1 }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Special Requirements"
                name="requirements"
                value={formData.requirements}
                onChange={handleChange}
                error={!!formErrors.requirements}
                helperText={formErrors.requirements}
                placeholder="Please specify any special requirements, preferences, or additional details for your event"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isLoading}
                sx={{ mt: 2 }}
              >
                {isLoading ? <CircularProgress size={24} /> : 'Submit Request'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateEventRequest; 