import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Tab,
  Tabs,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
  Alert,
} from '@mui/material';
import { getUserOrders, cancelOrder } from '../../store/slices/orderSlice';
import QrCodeIcon from '@mui/icons-material/QrCode';
import EventIcon from '@mui/icons-material/Event';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import { createEventRequest, getUserEventRequests } from '../../store/slices/eventRequestSlice';
import AddIcon from '@mui/icons-material/Add';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [openTicketDialog, setOpenTicketDialog] = useState(false);
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [requestData, setRequestData] = useState({
    title: '',
    description: '',
    expectedDate: '',
    expectedBudget: '',
    attendees: '',
    requirements: '',
  });
  const [requestError, setRequestError] = useState('');
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { orders, isLoading: ordersLoading } = useSelector((state) => state.orders);
  const { userRequests, isLoading: requestsLoading } = useSelector((state) => state.eventRequests);

  useEffect(() => {
    dispatch(getUserOrders());
    dispatch(getUserEventRequests());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCancelOrder = async () => {
    if (selectedOrder) {
      await dispatch(cancelOrder(selectedOrder._id));
      setOpenCancelDialog(false);
      setSelectedOrder(null);
      dispatch(getUserOrders());
    }
  };

  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setRequestData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitRequest = async () => {
    try {
      setRequestError(null);
      setLoading(true);

      // Validate title and description
      if (!requestData.title.trim()) {
        setRequestError('Please enter an event title');
        setLoading(false);
        return;
      }

      if (!requestData.description.trim()) {
        setRequestError('Please enter an event description');
        setLoading(false);
        return;
      }

      // Validate date
      if (!requestData.expectedDate) {
        setRequestError('Please select an expected date');
        setLoading(false);
        return;
      }

      const selectedDate = new Date(requestData.expectedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setRequestError('Expected date cannot be in the past');
        setLoading(false);
        return;
      }

      // Validate budget
      if (!requestData.expectedBudget || isNaN(requestData.expectedBudget)) {
        setRequestError('Please enter a valid budget amount');
        setLoading(false);
        return;
      }

      const budget = Number(requestData.expectedBudget);
      if (budget <= 0) {
        setRequestError('Budget must be greater than 0');
        setLoading(false);
        return;
      }

      // Validate attendees
      if (!requestData.attendees || isNaN(requestData.attendees)) {
        setRequestError('Please enter a valid number of attendees');
        setLoading(false);
        return;
      }

      const attendees = Number(requestData.attendees);
      if (attendees <= 0 || !Number.isInteger(attendees)) {
        setRequestError('Number of attendees must be a positive whole number');
        setLoading(false);
        return;
      }

      // Validate requirements
      if (!requestData.requirements.trim()) {
        setRequestError('Please specify your special requirements');
        setLoading(false);
        return;
      }

      // Format the data
      const formattedData = {
        title: requestData.title.trim(),
        description: requestData.description.trim(),
        expectedDate: selectedDate.toISOString(),
        expectedBudget: budget.toString(),
        attendees: attendees.toString(),
        requirements: requestData.requirements.trim()
      };

      const result = await dispatch(createEventRequest(formattedData)).unwrap();
      
      if (result) {
        setRequestSuccess('Event request submitted successfully!');
        setRequestData({
          title: '',
          description: '',
          expectedDate: '',
          expectedBudget: '',
          attendees: '',
          requirements: '',
        });
        setOpenRequestDialog(false);
      }
    } catch (error) {
      console.error('Event request submission error:', error);
      setRequestError(
        error.message || 
        'Failed to submit request. Please check your input and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderOrderCard = (order) => (
    <Card 
      key={order._id} 
      sx={{ 
        mb: 3,
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
        },
      }}
    >
      <Grid container>
        <Grid item xs={12} md={4}>
          <CardMedia
            component="img"
            height="200"
            image={order.event.images?.[0] || '/placeholder-event.jpg'}
            alt={order.event.title}
            sx={{ objectFit: 'cover' }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {order.event.title}
              </Typography>
              <Chip
                label={order.status.toUpperCase()}
                color={getStatusColor(order.status)}
                sx={{ fontWeight: 600 }}
              />
            </Box>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              Date: {new Date(order.event.date).toLocaleDateString()}
            </Typography>
            <Typography variant="body1" gutterBottom>
              Tickets: {order.numberOfTickets}
            </Typography>
            <Typography variant="h6" color="primary.main" gutterBottom>
              Total Amount: ${order.totalAmount}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<QrCodeIcon />}
                onClick={() => {
                  setSelectedOrder(order);
                  setOpenTicketDialog(true);
                }}
                sx={{ 
                  borderRadius: '50px',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                View Tickets
              </Button>
              {order.status !== 'cancelled' && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<CancelIcon />}
                  onClick={() => {
                    setSelectedOrder(order);
                    setOpenCancelDialog(true);
                  }}
                  sx={{ 
                    borderRadius: '50px',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Cancel Order
                </Button>
              )}
            </Box>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );

  const renderRequestCard = (request) => (
    <Card key={request._id} sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">{request.title}</Typography>
          <Chip
            label={request.status.toUpperCase()}
            color={getStatusColor(request.status)}
          />
        </Box>
        <Typography color="text.secondary" gutterBottom>
          Submitted: {formatDate(request.createdAt)}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Expected Date: {formatDate(request.expectedDate)}
        </Typography>
        <Typography gutterBottom>
          Budget: ${request.expectedBudget}
        </Typography>
        <Typography gutterBottom>
          Expected Attendees: {request.attendees}
        </Typography>
        {request.status === 'approved' && (
          <Alert severity="success" sx={{ mt: 1 }}>
            Your request has been approved! An organizer will contact you soon.
          </Alert>
        )}
        {request.status === 'rejected' && (
          <Alert severity="error" sx={{ mt: 1 }}>
            Your request has been rejected. Please check the comments for more information.
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  if (ordersLoading || requestsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: { xs: 8, sm: 9 }, mb: 6 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1A237E 0%, #AD1457 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            My Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenRequestDialog(true)}
            sx={{
              background: 'linear-gradient(135deg, #1A237E 0%, #AD1457 100%)',
              borderRadius: '50px',
              px: 3,
              py: 1,
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #1A237E 20%, #AD1457 120%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(173, 20, 87, 0.3)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Request Custom Event
          </Button>
        </Box>

        <Paper 
          sx={{ 
            width: '100%', 
            mb: 4,
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        >
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            centered
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#AD1457',
                height: 3,
              },
              '& .MuiTab-root': {
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                '&.Mui-selected': {
                  color: '#1A237E',
                },
              },
            }}
          >
            <Tab label="My Bookings" />
            <Tab label="My Requests" />
          </Tabs>
        </Paper>

        {tabValue === 0 && (
          <Box>
            {orders.length > 0 ? (
              orders.map((order) => renderOrderCard(order))
            ) : (
              <Paper 
                sx={{ 
                  p: 4, 
                  textAlign: 'center',
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.05) 0%, rgba(173, 20, 87, 0.05) 100%)',
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  No bookings found
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => navigate('/events')}
                  sx={{
                    mt: 2,
                    background: 'linear-gradient(135deg, #1A237E 0%, #AD1457 100%)',
                    borderRadius: '50px',
                    px: 4,
                    py: 1,
                    fontWeight: 600,
                    textTransform: 'none',
                  }}
                >
                  Browse Events
                </Button>
              </Paper>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Paper 
            sx={{ 
              p: 4,
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.05) 0%, rgba(173, 20, 87, 0.05) 100%)',
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Profile Information
                </Typography>
                <Divider sx={{ mb: 3 }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Name
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {user.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Email
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {user.email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Role
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>

      {/* Cancel Order Dialog */}
      <Dialog 
        open={openCancelDialog} 
        onClose={() => setOpenCancelDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Cancel Order</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this order? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button 
            onClick={() => setOpenCancelDialog(false)}
            sx={{ 
              color: '#1A237E',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(26, 35, 126, 0.1)',
              },
            }}
          >
            No, Keep Order
          </Button>
          <Button 
            onClick={handleCancelOrder} 
            variant="contained"
            color="error"
            sx={{ fontWeight: 600, px: 3 }}
          >
            Yes, Cancel Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Tickets Dialog */}
      <Dialog 
        open={openTicketDialog} 
        onClose={() => setOpenTicketDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Your Tickets</DialogTitle>
        <DialogContent>
          {selectedOrder?.tickets?.map((ticket, index) => (
            <Paper 
              key={index} 
              sx={{ 
                p: 3, 
                mb: 2,
                borderRadius: 2,
                background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.05) 0%, rgba(173, 20, 87, 0.05) 100%)',
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} sm={8}>
                  <Typography variant="h6" gutterBottom>
                    {selectedOrder.event.title}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Ticket #{ticket.ticketNumber} of {selectedOrder.numberOfTickets}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {new Date(selectedOrder.event.date).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Time: {selectedOrder.event.time}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Venue: {selectedOrder.event.location}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={4} sx={{ textAlign: 'center' }}>
                  <Box
                    component="img"
                    src={ticket.qrCode}
                    alt="QR Code"
                    sx={{
                      width: 120,
                      height: 120,
                      mb: 1,
                    }}
                  />
                  <Typography variant="caption" display="block">
                    Ticket ID: {ticket.ticketId}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button 
            onClick={() => setOpenTicketDialog(false)}
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #1A237E 0%, #AD1457 100%)',
              fontWeight: 600,
              px: 3,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Request Custom Event Dialog */}
      <Dialog 
        open={openRequestDialog} 
        onClose={() => setOpenRequestDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Request Custom Event</DialogTitle>
        <DialogContent>
          {requestSuccess ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              {requestSuccess}
            </Alert>
          ) : (
            <Box sx={{ mt: 2 }}>
              {requestError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {requestError}
                </Alert>
              )}
              <TextField
                fullWidth
                required
                label="Event Title"
                name="title"
                value={requestData.title}
                onChange={handleRequestChange}
                helperText="Enter a descriptive title for your event"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                required
                multiline
                rows={4}
                label="Event Description"
                name="description"
                value={requestData.description}
                onChange={handleRequestChange}
                helperText="Describe your event in detail"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                required
                type="date"
                label="Expected Date"
                name="expectedDate"
                value={requestData.expectedDate}
                onChange={handleRequestChange}
                InputLabelProps={{ shrink: true }}
                helperText="Select a future date for your event"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                required
                type="number"
                label="Expected Budget"
                name="expectedBudget"
                value={requestData.expectedBudget}
                onChange={handleRequestChange}
                helperText="Enter your budget in dollars (minimum $1)"
                inputProps={{ min: "1" }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                required
                type="number"
                label="Expected Number of Attendees"
                name="attendees"
                value={requestData.attendees}
                onChange={handleRequestChange}
                helperText="Enter the expected number of attendees (minimum 1)"
                inputProps={{ min: "1", step: "1" }}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                required
                multiline
                rows={3}
                label="Special Requirements"
                name="requirements"
                value={requestData.requirements}
                onChange={handleRequestChange}
                helperText="Specify any special requirements or preferences"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button 
            onClick={() => setOpenRequestDialog(false)}
            sx={{ 
              color: '#1A237E',
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitRequest}
            variant="contained"
            disabled={loading}
            sx={{
              background: 'linear-gradient(135deg, #1A237E 0%, #AD1457 100%)',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                background: 'linear-gradient(135deg, #1A237E 20%, #AD1457 120%)',
              },
            }}
          >
            Submit Request
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 