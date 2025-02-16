import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { getUserOrders, cancelOrder } from '../../store/slices/orderSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { orders, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getUserOrders());
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

  const renderOrderCard = (order) => (
    <Card key={order._id} sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8}>
            <Typography variant="h6">{order.event.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              Order ID: {order._id}
            </Typography>
            <Typography variant="body2">
              Date: {new Date(order.event.date).toLocaleDateString()}
            </Typography>
            <Typography variant="body2">
              Tickets: {order.numberOfTickets}
            </Typography>
            <Typography variant="body2">
              Total Amount: ${order.totalAmount}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
            <Chip
              label={order.status.toUpperCase()}
              color={getStatusColor(order.status)}
              sx={{ mb: 1 }}
            />
            {order.status !== 'cancelled' && (
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => {
                  setSelectedOrder(order);
                  setOpenCancelDialog(true);
                }}
              >
                Cancel Order
              </Button>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Dashboard
        </Typography>

        <Paper sx={{ width: '100%', mb: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="My Bookings" />
            <Tab label="Profile" />
          </Tabs>
        </Paper>

        {tabValue === 0 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              My Bookings
            </Typography>
            {orders.length > 0 ? (
              orders.map((order) => renderOrderCard(order))
            ) : (
              <Typography variant="body1" color="text.secondary" align="center">
                No bookings found
              </Typography>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Profile Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Name:</strong> {user.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Email:</strong> {user.email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Role:</strong>{' '}
                  {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}
      </Box>

      <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)}>
        <DialogTitle>Cancel Order</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to cancel this order? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)}>No, Keep Order</Button>
          <Button onClick={handleCancelOrder} color="error" variant="contained">
            Yes, Cancel Order
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Dashboard; 