import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  MonetizationOn as MonetizationOnIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { getOrganizerEvents } from '../../store/slices/eventSlice';
import { getUserOrders } from '../../store/slices/orderSlice';

const OrganizerAnalytics = () => {
  const dispatch = useDispatch();
  const { events, isLoading: eventsLoading } = useSelector((state) => state.events);
  const { orders, isLoading: ordersLoading } = useSelector((state) => state.orders);
  const [timeRange, setTimeRange] = useState('month');
  const [selectedEvent, setSelectedEvent] = useState('all');

  useEffect(() => {
    dispatch(getOrganizerEvents());
    dispatch(getUserOrders());
  }, [dispatch]);

  const calculateAnalytics = () => {
    if (!events || !orders) return null;

    let filteredOrders = orders;
    let filteredEvents = events;

    // Filter by time range
    const now = new Date();
    const timeRangeDate = new Date();
    switch (timeRange) {
      case 'week':
        timeRangeDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        timeRangeDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        timeRangeDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        break;
    }

    filteredOrders = orders.filter(order => new Date(order.createdAt) >= timeRangeDate);

    // Filter by specific event if selected
    if (selectedEvent !== 'all') {
      filteredOrders = filteredOrders.filter(order => order.event._id === selectedEvent);
      filteredEvents = events.filter(event => event._id === selectedEvent);
    }

    // Calculate statistics
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalTicketsSold = filteredOrders.reduce((sum, order) => sum + order.numberOfTickets, 0);
    const totalEvents = filteredEvents.length;
    const averageTicketsPerEvent = totalEvents > 0 ? totalTicketsSold / totalEvents : 0;

    return {
      totalRevenue,
      totalTicketsSold,
      totalEvents,
      averageTicketsPerEvent,
      revenuePerEvent: filteredEvents.map(event => ({
        eventName: event.title,
        revenue: filteredOrders
          .filter(order => order.event._id === event._id)
          .reduce((sum, order) => sum + order.totalAmount, 0)
      })),
      ticketsPerEvent: filteredEvents.map(event => ({
        eventName: event.title,
        tickets: filteredOrders
          .filter(order => order.event._id === event._id)
          .reduce((sum, order) => sum + order.numberOfTickets, 0)
      }))
    };
  };

  const analytics = calculateAnalytics();

  if (eventsLoading || ordersLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  const StatCard = ({ title, value, icon, color }) => (
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
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              backgroundColor: `${color}15`,
              borderRadius: '12px',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          <Box>
            <Typography variant="h6" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" color={color} fontWeight="bold">
              {value}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
            Analytics Dashboard
          </Typography>
          <Box display="flex" gap={2}>
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={timeRange}
                label="Time Range"
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <MenuItem value="week">Last Week</MenuItem>
                <MenuItem value="month">Last Month</MenuItem>
                <MenuItem value="year">Last Year</MenuItem>
                <MenuItem value="all">All Time</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Event</InputLabel>
              <Select
                value={selectedEvent}
                label="Event"
                onChange={(e) => setSelectedEvent(e.target.value)}
              >
                <MenuItem value="all">All Events</MenuItem>
                {events.map((event) => (
                  <MenuItem key={event._id} value={event._id}>
                    {event.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Revenue"
              value={`$${analytics?.totalRevenue.toFixed(2)}`}
              icon={<MonetizationOnIcon sx={{ fontSize: '2rem', color: '#2E7D32' }} />}
              color="#2E7D32"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Tickets Sold"
              value={analytics?.totalTicketsSold}
              icon={<PeopleIcon sx={{ fontSize: '2rem', color: '#1976D2' }} />}
              color="#1976D2"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Events"
              value={analytics?.totalEvents}
              icon={<EventIcon sx={{ fontSize: '2rem', color: '#9C27B0' }} />}
              color="#9C27B0"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Avg. Tickets/Event"
              value={analytics?.averageTicketsPerEvent.toFixed(0)}
              icon={<TrendingUpIcon sx={{ fontSize: '2rem', color: '#ED6C02' }} />}
              color="#ED6C02"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom color="primary">
              Revenue by Event
            </Typography>
            <Box sx={{ mt: 2 }}>
              {analytics?.revenuePerEvent.map((event, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body1">{event.eventName}</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      ${event.revenue.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${(event.revenue / analytics.totalRevenue) * 100}%`,
                        height: '100%',
                        backgroundColor: 'primary.main',
                        transition: 'width 1s ease-in-out',
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom color="primary">
              Tickets Sold by Event
            </Typography>
            <Box sx={{ mt: 2 }}>
              {analytics?.ticketsPerEvent.map((event, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body1">{event.eventName}</Typography>
                    <Typography variant="body1" fontWeight="bold">
                      {event.tickets} tickets
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: '100%',
                      height: '8px',
                      backgroundColor: '#f0f0f0',
                      borderRadius: '4px',
                      overflow: 'hidden',
                    }}
                  >
                    <Box
                      sx={{
                        width: `${(event.tickets / analytics.totalTicketsSold) * 100}%`,
                        height: '100%',
                        backgroundColor: 'secondary.main',
                        transition: 'width 1s ease-in-out',
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default OrganizerAnalytics; 