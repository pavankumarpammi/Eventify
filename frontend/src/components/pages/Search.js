import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import SearchIcon from '@mui/icons-material/Search';
import { getEvents } from '../../store/slices/eventSlice';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { events, isLoading } = useSelector((state) => state.events);

  const [searchParams, setSearchParams] = useState({
    keyword: '',
    category: '',
    dateFrom: null,
    dateTo: null,
    priceRange: [0, 5000],
    location: '',
  });

  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    dispatch(getEvents({}));
  }, [dispatch]);

  useEffect(() => {
    filterEvents();
  }, [searchParams, events]);

  const filterEvents = () => {
    let filtered = [...events];

    // Keyword search
    if (searchParams.keyword) {
      const keyword = searchParams.keyword.toLowerCase();
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(keyword) ||
        event.description.toLowerCase().includes(keyword)
      );
    }

    // Category filter
    if (searchParams.category) {
      filtered = filtered.filter(event => event.category === searchParams.category);
    }

    // Date range filter
    if (searchParams.dateFrom) {
      filtered = filtered.filter(event => new Date(event.date) >= searchParams.dateFrom);
    }
    if (searchParams.dateTo) {
      filtered = filtered.filter(event => new Date(event.date) <= searchParams.dateTo);
    }

    // Price range filter
    filtered = filtered.filter(event =>
      event.price >= searchParams.priceRange[0] &&
      event.price <= searchParams.priceRange[1]
    );

    // Location filter
    if (searchParams.location) {
      const location = searchParams.location.toLowerCase();
      filtered = filtered.filter(event =>
        event.location.toLowerCase().includes(location)
      );
    }

    setFilteredEvents(filtered);
  };

  const handleChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePriceChange = (event, newValue) => {
    setSearchParams(prev => ({
      ...prev,
      priceRange: newValue
    }));
  };

  const handleEventClick = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 10, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Advanced Search
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Keywords"
              value={searchParams.keyword}
              onChange={(e) => handleChange('keyword', e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={searchParams.category}
                label="Category"
                onChange={(e) => handleChange('category', e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="conference">Conference</MenuItem>
                <MenuItem value="workshop">Workshop</MenuItem>
                <MenuItem value="concert">Concert</MenuItem>
                <MenuItem value="exhibition">Exhibition</MenuItem>
                <MenuItem value="sports">Sports</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Location"
              value={searchParams.location}
              onChange={(e) => handleChange('location', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <DatePicker
                  label="From Date"
                  value={searchParams.dateFrom}
                  onChange={(date) => handleChange('dateFrom', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
                <DatePicker
                  label="To Date"
                  value={searchParams.dateTo}
                  onChange={(date) => handleChange('dateTo', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Box>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography gutterBottom>Price Range</Typography>
            <Slider
              value={searchParams.priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0}
              max={5000}
              step={100}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="text.secondary">
                ${searchParams.priceRange[0]}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ${searchParams.priceRange[1]}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {isLoading ? (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>
              {filteredEvents.length} Results Found
            </Typography>

            <Grid container spacing={3}>
              {filteredEvents.map((event) => (
                <Grid item xs={12} md={6} lg={4} key={event._id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                      },
                    }}
                    onClick={() => handleEventClick(event._id)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={event.images[0] || '/placeholder-event.jpg'}
                      alt={event.title}
                    />
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {event.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                        <Chip label={event.category} size="small" color="primary" />
                        <Chip label={`$${event.price}`} size="small" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(event.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {event.location}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {filteredEvents.length === 0 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                No events found matching your search criteria.
              </Alert>
            )}
          </>
        )}
      </Paper>
    </Container>
  );
};

export default Search; 