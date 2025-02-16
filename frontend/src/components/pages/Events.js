import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Pagination,
  CircularProgress,
  Chip,
  Paper,
  Slider,
  Divider,
  IconButton,
} from '@mui/material';
import { getEvents } from '../../store/slices/eventSlice';
import EventIcon from '@mui/icons-material/Event';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const Events = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [dateFilter, setDateFilter] = useState('all');

  const { events, isLoading, pages } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(getEvents({ page, category, search: searchQuery }));
  }, [dispatch, page, category, searchQuery]);

  const categories = [
    'conference',
    'workshop',
    'concert',
    'exhibition',
    'sports',
    'other',
  ];

  const dateFilters = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
  ];

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleDateFilterChange = (e) => {
    setDateFilter(e.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const filterEvents = (events) => {
    if (!Array.isArray(events)) return [];
    
    return events.filter(event => {
      // Price filter
      if (event.price < priceRange[0] || event.price > priceRange[1]) return false;

      // Date filter
      const eventDate = new Date(event.date);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      switch (dateFilter) {
        case 'today':
          if (eventDate.toDateString() !== today.toDateString()) return false;
          break;
        case 'tomorrow':
          if (eventDate.toDateString() !== tomorrow.toDateString()) return false;
          break;
        case 'week':
          const nextWeek = new Date(today);
          nextWeek.setDate(nextWeek.getDate() + 7);
          if (eventDate > nextWeek || eventDate < today) return false;
          break;
        case 'month':
          const nextMonth = new Date(today);
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          if (eventDate > nextMonth || eventDate < today) return false;
          break;
        default:
          break;
      }

      return true;
    });
  };

  const filteredEvents = filterEvents(events);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/assets/events.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    if (imagePath.startsWith('/uploads')) return imagePath;
    return `/assets/${imagePath}`;
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 12, mb: 8 }}>
      <Grid container spacing={4}>
        {/* Filters Sidebar */}
        <Grid item xs={12} md={3}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 3, 
              mb: { xs: 3, md: 0 },
              borderRadius: '16px',
              border: '1px solid rgba(26,35,126,0.1)',
              background: 'white',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 8px 25px rgba(26,35,126,0.15)',
              },
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                color: '#1A237E',
                fontWeight: 600,
              }}
            >
              <FilterListIcon sx={{ mr: 1 }} /> Filters
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Search Events"
                variant="outlined"
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': {
                      borderColor: '#AD1457',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1A237E',
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select 
                  value={category} 
                  label="Category" 
                  onChange={handleCategoryChange}
                  sx={{
                    borderRadius: '12px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#AD1457',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1A237E',
                    },
                  }}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography gutterBottom sx={{ color: '#1A237E', fontWeight: 500 }}>
                Price Range
              </Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={10000}
                step={100}
                sx={{
                  color: '#AD1457',
                  '& .MuiSlider-thumb': {
                    '&:hover, &.Mui-focusVisible': {
                      boxShadow: '0 0 0 8px rgba(173,20,87,0.1)',
                    },
                  },
                  '& .MuiSlider-rail': {
                    opacity: 0.3,
                  },
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#1A237E' }}>₹{priceRange[0]}</Typography>
                <Typography variant="body2" sx={{ color: '#1A237E' }}>₹{priceRange[1]}</Typography>
              </Box>
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Date</InputLabel>
                <Select 
                  value={dateFilter} 
                  label="Date" 
                  onChange={handleDateFilterChange}
                  sx={{
                    borderRadius: '12px',
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#AD1457',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1A237E',
                    },
                  }}
                >
                  {dateFilters.map((filter) => (
                    <MenuItem key={filter.value} value={filter.value}>
                      {filter.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Paper>
        </Grid>

        {/* Events Grid */}
        <Grid item xs={12} md={9}>
          {filteredEvents.length === 0 ? (
            <Paper 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                borderRadius: '16px',
                border: '1px solid rgba(26,35,126,0.1)',
                background: 'white',
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: '#1A237E' }}>
                No events found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting your filters or search criteria
              </Typography>
            </Paper>
          ) : (
            <>
              <Grid container spacing={3}>
                {filteredEvents.map((event) => (
                  <Grid item key={event._id} xs={12} sm={6} lg={4}>
                    <Card 
                      sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        flexDirection: 'column',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid rgba(26,35,126,0.1)',
                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          boxShadow: '0 12px 25px rgba(26,35,126,0.2)',
                        },
                      }}
                    >
                      <CardMedia
                        component="div"
                        sx={{
                          height: 200,
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          component="img"
                          src={getImageUrl(event.images[0])}
                          alt={event.title}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                              transform: 'scale(1.05)',
                            },
                          }}
                          onError={(e) => {
                            e.target.src = '/assets/events.jpg';
                          }}
                        />
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 16,
                            left: 16,
                            right: 16,
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <Chip
                            label={event.category.toUpperCase()}
                            sx={{ 
                              backdropFilter: 'blur(4px)',
                              backgroundColor: 'rgba(26,35,126,0.8)',
                              color: 'white',
                              fontWeight: 600,
                            }}
                            size="small"
                          />
                          {event.organizer?.isOrganizerVerified && (
                            <Chip
                              label="Verified"
                              sx={{ 
                                backdropFilter: 'blur(4px)',
                                backgroundColor: 'rgba(173,20,87,0.8)',
                                color: 'white',
                                fontWeight: 600,
                              }}
                              size="small"
                            />
                          )}
                        </Box>
                      </CardMedia>

                      <CardContent sx={{ flexGrow: 1, p: 3 }}>
                        <Typography 
                          variant="h6" 
                          gutterBottom
                          sx={{ 
                            color: '#1A237E',
                            fontWeight: 600,
                            minHeight: '64px',
                          }}
                        >
                          {event.title}
                        </Typography>

                        <Box sx={{ mb: 2, flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <EventIcon sx={{ mr: 1, color: '#1A237E' }} />
                            <Typography variant="body2" sx={{ color: '#1A237E' }}>
                              {new Date(event.date).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AccessTimeIcon sx={{ mr: 1, color: '#1A237E' }} />
                            <Typography variant="body2" sx={{ color: '#1A237E' }}>
                              {event.time}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <LocationOnIcon sx={{ mr: 1, color: '#1A237E' }} />
                            <Typography variant="body2" sx={{ color: '#1A237E' }}>
                              {event.location}
                            </Typography>
                          </Box>
                        </Box>

                        <Box sx={{ mt: 'auto' }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="h6" sx={{ color: '#AD1457', fontWeight: 600 }}>
                              ₹{event.price.toLocaleString('en-IN')}
                            </Typography>
                            <Chip
                              label={`${event.availableTickets} left`}
                              color={event.availableTickets > 0 ? 'success' : 'error'}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </Box>
                          <Button
                            variant="contained"
                            fullWidth
                            onClick={() => navigate(`/events/${event._id}`)}
                            disabled={event.availableTickets === 0}
                            sx={{
                              background: 'linear-gradient(45deg, #1A237E 30%, #AD1457 90%)',
                              color: 'white',
                              py: 1.5,
                              borderRadius: '12px',
                              textTransform: 'none',
                              fontWeight: 600,
                              '&:hover': {
                                background: 'linear-gradient(45deg, #1A237E 30%, #AD1457 90%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 8px 20px rgba(26,35,126,0.3)',
                              },
                              transition: 'all 0.3s ease',
                              '&:disabled': {
                                background: '#ccc',
                                color: '#666',
                              },
                            }}
                          >
                            {event.availableTickets === 0 ? 'Sold Out' : 'Book Now'}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {pages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                  <Pagination
                    count={pages}
                    page={page}
                    onChange={handlePageChange}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: '#1A237E',
                        '&.Mui-selected': {
                          background: 'linear-gradient(45deg, #1A237E 30%, #AD1457 90%)',
                          color: 'white',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #1A237E 30%, #AD1457 90%)',
                          },
                        },
                      },
                    }}
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Events; 