import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, parseISO } from 'date-fns';
import { getEvents } from '../../store/slices/eventSlice';
import { useNavigate } from 'react-router-dom';

const Calendar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { events, isLoading } = useSelector((state) => state.events);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    dispatch(getEvents({}));
  }, [dispatch]);

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, events]);

  const generateCalendarDays = () => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start, end });

    // Add days from previous month to start from Sunday
    const startDay = start.getDay();
    const prevDays = eachDayOfInterval({
      start: subMonths(start, 1),
      end: subMonths(start, 1),
    }).slice(-startDay);

    // Add days from next month to end on Saturday
    const endDay = end.getDay();
    const nextDays = eachDayOfInterval({
      start: addMonths(end, 1),
      end: addMonths(end, 1),
    }).slice(0, 6 - endDay);

    setCalendarDays([...prevDays, ...days, ...nextDays]);
  };

  const formatEventDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(parseISO(dateString), 'EEEE, MMMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Date not available';
    }
  };

  const getEventsForDay = (day) => {
    if (!events) return [];
    return events.filter(event => {
      try {
        return event.date && isSameDay(parseISO(event.date), day);
      } catch (error) {
        console.error('Error comparing dates:', error);
        return false;
      }
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleEventDialogClose = () => {
    setSelectedEvent(null);
  };

  const handleViewEventDetails = () => {
    navigate(`/events/${selectedEvent._id}`);
    handleEventDialogClose();
  };

  const renderEventDialog = () => (
    <Dialog open={!!selectedEvent} onClose={handleEventDialogClose} maxWidth="sm" fullWidth>
      <DialogTitle>{selectedEvent?.title || 'Event Details'}</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" color="primary" gutterBottom>
            {selectedEvent?.date ? formatEventDate(selectedEvent.date) : 'Date not available'}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Time: {selectedEvent?.time || 'Not specified'}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Location: {selectedEvent?.location || 'Not specified'}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Price: ${selectedEvent?.price || '0'}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Available Tickets: {selectedEvent?.availableTickets || '0'}
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {selectedEvent?.description || 'No description available'}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleEventDialogClose}>Close</Button>
        {selectedEvent && (
          <Button onClick={handleViewEventDetails} variant="contained" color="primary">
            View Details
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, gap: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, flex: 1 }}>
            Event Calendar
          </Typography>
          <Button
            startIcon={<TodayIcon />}
            onClick={handleToday}
            variant="outlined"
            size="small"
          >
            Today
          </Button>
          <IconButton onClick={handlePrevMonth}>
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 500, minWidth: 200, textAlign: 'center' }}>
            {format(currentDate, 'MMMM yyyy')}
          </Typography>
          <IconButton onClick={handleNextMonth}>
            <ChevronRightIcon />
          </IconButton>
        </Box>

        <Grid container spacing={1}>
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
            <Grid item xs key={day}>
              <Box sx={{ p: 1, textAlign: 'center', bgcolor: 'primary.main', color: 'white', borderRadius: 1 }}>
                <Typography variant="subtitle2">{day}</Typography>
              </Box>
            </Grid>
          ))}

          {calendarDays.map((day, index) => {
            const dayEvents = getEventsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isToday = isSameDay(day, new Date());

            return (
              <Grid item xs key={index}>
                <Card
                  sx={{
                    height: 120,
                    bgcolor: isCurrentMonth ? 'background.paper' : 'action.hover',
                    border: isToday ? 2 : 0,
                    borderColor: 'primary.main',
                    opacity: isCurrentMonth ? 1 : 0.7,
                    overflow: 'hidden',
                  }}
                >
                  <CardContent sx={{ p: 1, height: '100%' }}>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isToday ? 700 : 400,
                        color: isToday ? 'primary.main' : 'text.primary',
                      }}
                    >
                      {format(day, 'd')}
                    </Typography>
                    <Box sx={{ mt: 0.5, overflow: 'auto', maxHeight: 'calc(100% - 24px)' }}>
                      {dayEvents.map((event, i) => (
                        <Tooltip key={i} title={event.title}>
                          <Chip
                            icon={<EventIcon sx={{ fontSize: 16 }} />}
                            label={event.title}
                            size="small"
                            onClick={() => handleEventClick(event)}
                            sx={{
                              mb: 0.5,
                              width: '100%',
                              fontSize: '0.7rem',
                              '& .MuiChip-label': {
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              },
                            }}
                            color={event.category === 'conference' ? 'primary' : 
                                   event.category === 'workshop' ? 'secondary' :
                                   event.category === 'concert' ? 'success' :
                                   event.category === 'exhibition' ? 'warning' : 'default'}
                          />
                        </Tooltip>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
      {renderEventDialog()}
    </Container>
  );
};

export default Calendar; 