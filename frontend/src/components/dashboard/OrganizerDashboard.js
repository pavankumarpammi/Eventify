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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CommentIcon from '@mui/icons-material/Comment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { getOrganizerEvents, deleteEvent } from '../../store/slices/eventSlice';
import { getAllEventRequests, updateEventRequest } from '../../store/slices/eventRequestSlice';
import axios from 'axios';

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [eventRequests, setEventRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [openRequestDialog, setOpenRequestDialog] = useState(false);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const { events, isLoading } = useSelector((state) => state.events);
  const { requests = [], isLoading: isLoadingRequests = false } = useSelector((state) => state.eventRequests || {});

  useEffect(() => {
    dispatch(getOrganizerEvents());
    dispatch(getAllEventRequests());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      await dispatch(deleteEvent(selectedEvent._id));
      setOpenDeleteDialog(false);
      setSelectedEvent(null);
      dispatch(getOrganizerEvents());
    }
  };

  const handleUpdateRequest = async (requestId, status) => {
    try {
      await dispatch(updateEventRequest({
        requestId,
        updateData: {
          status,
          assignedTo: user._id,
          comment: comment
        }
      }));
      setComment('');
      setOpenRequestDialog(false);
      setSelectedRequest(null);
      dispatch(getAllEventRequests());
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'primary';
      case 'ongoing':
        return 'success';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'error';
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

  const renderEventCard = (event) => (
    <Card 
      key={event._id} 
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
            height="240"
            image={event.images[0] || '/placeholder-event.jpg'}
            alt={event.title}
            sx={{
              objectFit: 'cover',
              borderRadius: { xs: '16px 16px 0 0', md: '16px 0 0 16px' },
            }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <CardContent sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}
            >
              <Box>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 600,
                    mb: 1,
                    background: 'linear-gradient(135deg, #1A237E 0%, #AD1457 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  {event.title}
                </Typography>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  Date: {new Date(event.date).toLocaleDateString()}
                </Typography>
                <Typography 
                  variant="body1"
                  sx={{ 
                    mb: 1,
                    fontWeight: 500,
                  }}
                >
                  Available Tickets: {event.availableTickets}/{event.totalTickets}
                </Typography>
                <Typography 
                  variant="h6"
                  sx={{ 
                    color: '#1A237E',
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  ${event.price}
                </Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <Chip
                    label={event.status.toUpperCase()}
                    color={getStatusColor(event.status)}
                    sx={{
                      borderRadius: '8px',
                      fontWeight: 600,
                    }}
                  />
                  {!event.isPublished && (
                    <Chip
                      label="DRAFT"
                      color="warning"
                      sx={{
                        borderRadius: '8px',
                        fontWeight: 600,
                      }}
                    />
                  )}
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  onClick={() => navigate(`/organizer/events/${event._id}/edit`)}
                  sx={{
                    bgcolor: 'rgba(26, 35, 126, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(26, 35, 126, 0.2)',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <EditIcon sx={{ color: '#1A237E' }} />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setSelectedEvent(event);
                    setOpenDeleteDialog(true);
                  }}
                  sx={{
                    bgcolor: 'rgba(173, 20, 87, 0.1)',
                    '&:hover': {
                      bgcolor: 'rgba(173, 20, 87, 0.2)',
                      transform: 'scale(1.1)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <DeleteIcon sx={{ color: '#AD1457' }} />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );

  const renderRequestCard = (request) => (
    <Card 
      key={request._id} 
      sx={{ 
        mb: 3,
        borderRadius: 4,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {request.title}
          </Typography>
          <Chip
            label={request.status.toUpperCase()}
            color={getStatusColor(request.status)}
            sx={{ fontWeight: 600 }}
          />
        </Box>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Requested by: {request.user?.name || 'Unknown User'}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Expected Date: {new Date(request.expectedDate).toLocaleDateString()}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Budget: ${request.expectedBudget}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Attendees: {request.attendees}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Description: {request.description}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Requirements: {request.requirements}
        </Typography>

        {request.status === 'pending' && (
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              onClick={() => handleUpdateRequest(request._id, 'approved')}
              sx={{ 
                borderRadius: '50px',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Approve
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => handleUpdateRequest(request._id, 'rejected')}
              sx={{ 
                borderRadius: '50px',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Reject
            </Button>
            <Button
              variant="outlined"
              startIcon={<CommentIcon />}
              onClick={() => {
                setSelectedRequest(request);
                setOpenRequestDialog(true);
              }}
              sx={{ 
                borderRadius: '50px',
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Add Comment
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  if (isLoading || isLoadingRequests || loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
      >
        <CircularProgress sx={{ color: '#1A237E' }} />
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ mt: { xs: 8, sm: 9 }, mb: 6 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 2, sm: 0 },
            mb: 4,
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1A237E 0%, #AD1457 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Organizer Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/organizer/create-event')}
            sx={{
              background: 'linear-gradient(135deg, #1A237E 0%, #AD1457 100%)',
              borderRadius: '50px',
              px: 4,
              py: 1,
              fontWeight: 600,
              whiteSpace: 'nowrap',
              '&:hover': {
                background: 'linear-gradient(135deg, #1A237E 20%, #AD1457 120%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 20px rgba(173, 20, 87, 0.3)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Create Event
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
            <Tab label="My Events" />
            <Tab label="Event Requests" />
          </Tabs>
        </Paper>

        {tabValue === 0 && (
          <Box>
            {events.length > 0 ? (
              events.map((event) => renderEventCard(event))
            ) : (
              <Typography 
                variant="h6" 
                color="text.secondary" 
                align="center"
                sx={{ mt: 4 }}
              >
                No events found. Create your first event!
              </Typography>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            {requests && requests.length > 0 ? (
              requests.map((request) => renderRequestCard(request))
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
                  No event requests found
                </Typography>
              </Paper>
            )}
          </Box>
        )}
      </Box>

      <Dialog 
        open={openDeleteDialog} 
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          },
        }}
      >
        <DialogTitle 
          sx={{ 
            color: '#1A237E',
            fontWeight: 600,
          }}
        >
          Delete Event
        </DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this event? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button 
            onClick={() => setOpenDeleteDialog(false)}
            sx={{
              color: '#1A237E',
              fontWeight: 600,
              '&:hover': {
                backgroundColor: 'rgba(26, 35, 126, 0.1)',
              },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteEvent} 
            variant="contained"
            color="error"
            sx={{ fontWeight: 600, px: 3 }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
        <DialogTitle sx={{ fontWeight: 600 }}>Add Comment</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            {selectedRequest?.comments?.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Previous Comments
                </Typography>
                {selectedRequest.comments.map((comment, index) => (
                  <Paper 
                    key={index}
                    sx={{ 
                      p: 2, 
                      mb: 2,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, rgba(26, 35, 126, 0.05) 0%, rgba(173, 20, 87, 0.05) 100%)',
                    }}
                  >
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {comment.user.name} - {new Date(comment.createdAt).toLocaleString()}
                    </Typography>
                    <Typography variant="body1">
                      {comment.text}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>
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
            onClick={() => handleUpdateRequest(selectedRequest._id, selectedRequest.status)}
            variant="contained"
            disabled={!comment.trim()}
            sx={{
              background: 'linear-gradient(135deg, #1A237E 0%, #AD1457 100%)',
              fontWeight: 600,
              px: 3,
              '&:hover': {
                background: 'linear-gradient(135deg, #1A237E 20%, #AD1457 120%)',
              },
            }}
          >
            Add Comment
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default OrganizerDashboard; 