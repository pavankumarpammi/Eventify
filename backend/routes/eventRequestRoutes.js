const express = require('express');
const router = express.Router();
const {
    createEventRequest,
    getEventRequests,
    getUserEventRequests,
    updateEventRequest,
    addEventRequestComment
} = require('../controllers/eventRequestController');
const { protect, organizer } = require('../middleware/authMiddleware');

// Create new event request
router.post('/', protect, createEventRequest);

// Get all event requests (for organizers)
router.get('/', protect, organizer, getEventRequests);

// Get user's event requests
router.get('/me', protect, getUserEventRequests);

// Update event request status
router.put('/:id', protect, organizer, updateEventRequest);

// Add comment to event request
router.post('/:id/comments', protect, addEventRequestComment);

// Error handling middleware
router.use((err, req, res, next) => {
    console.error('Event Request Route Error:', err);
    res.status(500).json({
        message: 'Internal server error in event request route',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = router; 