import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Tab,
  Tabs,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Link,
} from '@mui/material';
import { getEvents } from '../../store/slices/eventSlice';
import axios from 'axios';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [openVerifyDialog, setOpenVerifyDialog] = useState(false);
  const [organizers, setOrganizers] = useState([]);
  const [loading, setLoading] = useState(false);

  const { events, isLoading } = useSelector((state) => state.events);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getEvents({}));
    fetchOrganizers();
  }, [dispatch]);

  const fetchOrganizers = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const response = await axios.get('/api/users', config);
      setOrganizers(response.data.filter(user => user.role === 'organizer'));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching organizers:', error);
      setLoading(false);
    }
  };

  const handleVerifyOrganizer = async () => {
    if (selectedOrganizer) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        await axios.put(
          `/api/users/verify-organizer/${selectedOrganizer._id}`,
          {},
          config
        );
        setOpenVerifyDialog(false);
        setSelectedOrganizer(null);
        fetchOrganizers(); // Refresh organizers list
      } catch (error) {
        console.error('Error verifying organizer:', error);
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getVerificationStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const calculateAnalytics = () => {
    const totalEvents = events.length;
    const totalOrganizers = organizers.length;
    const totalRevenue = events.reduce(
      (sum, event) =>
        sum + event.price * (event.totalTickets - event.availableTickets),
      0
    );

    return {
      totalEvents,
      totalOrganizers,
      totalRevenue,
    };
  };

  const analytics = calculateAnalytics();

  if (isLoading || loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4">{analytics.totalEvents}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Events
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4">{analytics.totalOrganizers}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Organizers
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4">
                ${analytics.totalRevenue.toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Revenue
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper sx={{ width: '100%', mb: 4 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Organizers" />
            <Tab label="Events" />
          </Tabs>
        </Paper>

        {tabValue === 0 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Company</TableCell>
                  <TableCell>Documents</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {organizers.map((organizer) => (
                  <TableRow key={organizer._id}>
                    <TableCell>{organizer.name}</TableCell>
                    <TableCell>{organizer.email}</TableCell>
                    <TableCell>
                      {organizer.organizerDetails?.companyName || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {organizer.organizerDetails?.documents?.map((doc, index) => (
                        <Link
                          key={index}
                          href={doc}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Document {index + 1}
                        </Link>
                      ))}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={organizer.organizerDetails?.verificationStatus.toUpperCase()}
                        color={getVerificationStatusColor(
                          organizer.organizerDetails?.verificationStatus
                        )}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {organizer.organizerDetails?.verificationStatus === 'pending' && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            setSelectedOrganizer(organizer);
                            setOpenVerifyDialog(true);
                          }}
                        >
                          Verify
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tabValue === 1 && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event</TableCell>
                  <TableCell>Organizer</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Tickets Sold</TableCell>
                  <TableCell>Revenue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event._id}>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{event.organizer?.name}</TableCell>
                    <TableCell>
                      {new Date(event.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={event.status.toUpperCase()}
                        color={
                          event.status === 'upcoming'
                            ? 'primary'
                            : event.status === 'ongoing'
                            ? 'success'
                            : 'default'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {event.totalTickets - event.availableTickets}/
                      {event.totalTickets}
                    </TableCell>
                    <TableCell>
                      $
                      {(
                        event.price *
                        (event.totalTickets - event.availableTickets)
                      ).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Dialog open={openVerifyDialog} onClose={() => setOpenVerifyDialog(false)}>
        <DialogTitle>Verify Organizer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to verify {selectedOrganizer?.name} as an event organizer?
            This will allow them to create and manage events on the platform.
          </DialogContentText>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Company: {selectedOrganizer?.organizerDetails?.companyName}</Typography>
            <Typography variant="subtitle2">Email: {selectedOrganizer?.email}</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenVerifyDialog(false)}>Cancel</Button>
          <Button onClick={handleVerifyOrganizer} color="primary" variant="contained">
            Verify Organizer
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard; 