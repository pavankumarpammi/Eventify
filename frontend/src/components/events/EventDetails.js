import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Paper,
  Divider,
  TextField,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { getEventById } from '../../store/slices/eventSlice';
import { createOrder } from '../../store/slices/orderSlice';
import PaymentGateway from './PaymentGateway';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [tickets, setTickets] = useState(1);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const { event, isLoading } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);
  const { isLoading: isBooking } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getEventById(id));
  }, [dispatch, id]);

  const handleTicketChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= event?.availableTickets) {
      setTickets(value);
      setBookingError('');
    }
  };

  const handleInitiateBooking = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setOpenPaymentDialog(true);
  };

  const handlePaymentSuccess = () => {
    const orderData = {
      eventId: event._id,
      numberOfTickets: tickets,
      billingDetails: {
        name: user.name,
        email: user.email,
      }
    };

    dispatch(createOrder(orderData))
      .unwrap()
      .then((response) => {
        setOpenPaymentDialog(false);
        navigate(`/dashboard`);
      })
      .catch((error) => {
        setBookingError(error);
      });
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!event) {
    return (
      <Container>
        <Alert severity="error">Event not found</Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Box
              component="img"
              sx={{
                width: '100%',
                height: 400,
                objectFit: 'cover',
                borderRadius: 2,
              }}
              src={event.images[0] || '/placeholder-event.jpg'}
              alt={event.title}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h4" gutterBottom>
              {event.title}
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              ${event.price}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {new Date(event.date).toLocaleDateString()} at {event.time}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              {event.location}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Available Tickets: {event.availableTickets}
            </Typography>

            <Box sx={{ mt: 3 }}>
              <TextField
                type="number"
                label="Number of Tickets"
                value={tickets}
                onChange={handleTicketChange}
                fullWidth
                InputProps={{ inputProps: { min: 1, max: event.availableTickets } }}
                sx={{ mb: 2 }}
              />
              {bookingError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {bookingError}
                </Alert>
              )}
              <Button
                variant="contained"
                fullWidth
                onClick={handleInitiateBooking}
                disabled={isBooking || event.availableTickets === 0}
              >
                {isBooking
                  ? 'Processing...'
                  : event.availableTickets === 0
                  ? 'Sold Out'
                  : `Book Now - $${event.price * tickets}`}
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h5" gutterBottom>
              About This Event
            </Typography>
            <Typography paragraph>{event.description}</Typography>
          </Grid>

          {event.features && event.features.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h5" gutterBottom>
                Event Features
              </Typography>
              {event.features.map((feature, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography variant="h6">{feature.name}</Typography>
                  <Typography>{feature.description}</Typography>
                </Box>
              ))}
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom>
              Organizer
            </Typography>
            <Typography>
              {event.organizer?.name || 'Unknown'} -{' '}
              {event.organizer?.organizerDetails?.companyName || 'Independent Organizer'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <PaymentGateway
        open={openPaymentDialog}
        onClose={() => setOpenPaymentDialog(false)}
        onSuccess={handlePaymentSuccess}
        amount={event?.price * tickets}
        eventDetails={event}
        ticketCount={tickets}
      />
    </Container>
  );
};

export default EventDetails; 