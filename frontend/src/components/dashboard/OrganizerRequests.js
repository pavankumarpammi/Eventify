import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  getAllEventRequests,
  updateEventRequest,
  addEventRequestComment,
} from '../../store/slices/eventRequestSlice';

const OrganizerRequests = () => {
  const dispatch = useDispatch();
  const { requests, isLoading, error } = useSelector((state) => state.eventRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [comment, setComment] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    dispatch(getAllEventRequests());
  }, [dispatch]);

  const handleStatusUpdate = async (requestId, newStatus) => {
    try {
      await dispatch(updateEventRequest({
        requestId,
        updateData: { status: newStatus }
      })).unwrap();
      setOpenDialog(false);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    try {
      await dispatch(addEventRequestComment({
        requestId: selectedRequest._id,
        comment: comment.trim()
      })).unwrap();
      setComment('');
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
          Custom Event Requests
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage and respond to custom event requests from users
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {requests.map((request) => (
          <Grid item xs={12} key={request._id}>
            <Card 
              elevation={3}
              sx={{
                borderRadius: 2,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                },
              }}
            >
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom>
                      {request.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {request.description}
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Requested by: {request.user.name}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        Expected Date: {formatDate(request.expectedDate)}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        Budget: {formatCurrency(request.expectedBudget)}
                      </Typography>
                      <Typography variant="subtitle2" color="text.secondary">
                        Attendees: {request.attendees}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2" color="text.primary">
                      Requirements:
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {request.requirements}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'flex-end' }}>
                      <Chip
                        label={request.status.toUpperCase()}
                        color={getStatusColor(request.status)}
                        sx={{ fontWeight: 'bold' }}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setSelectedRequest(request);
                          setOpenDialog(true);
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedRequest && (
          <>
            <DialogTitle>
              <Typography variant="h6">Request Details</Typography>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 3 }}>
                <Typography variant="h5" gutterBottom>
                  {selectedRequest.title}
                </Typography>
                <Chip
                  label={selectedRequest.status.toUpperCase()}
                  color={getStatusColor(selectedRequest.status)}
                  sx={{ mb: 2 }}
                />
                <Typography variant="body1" paragraph>
                  {selectedRequest.description}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Requested by: {selectedRequest.user.name}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      Email: {selectedRequest.user.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Expected Date: {formatDate(selectedRequest.expectedDate)}
                    </Typography>
                    <Typography variant="subtitle2" color="text.secondary">
                      Budget: {formatCurrency(selectedRequest.expectedBudget)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Comments
                </Typography>
                <Box sx={{ mb: 2 }}>
                  {selectedRequest.comments.map((comment, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                      <Typography variant="subtitle2" color="primary">
                        {comment.user.name}
                      </Typography>
                      <Typography variant="body2">
                        {comment.text}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(comment.createdAt)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Add a comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <Button
                  variant="outlined"
                  onClick={handleAddComment}
                  disabled={!comment.trim()}
                >
                  Add Comment
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Update Status
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    color="success"
                    onClick={() => handleStatusUpdate(selectedRequest._id, 'approved')}
                    disabled={selectedRequest.status === 'approved'}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleStatusUpdate(selectedRequest._id, 'rejected')}
                    disabled={selectedRequest.status === 'rejected'}
                  >
                    Reject
                  </Button>
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default OrganizerRequests;