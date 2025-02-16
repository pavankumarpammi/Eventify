const EventRequest = require('../models/eventRequestModel');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

// @desc    Create a new event request
// @route   POST /api/event-requests
// @access  Private
const createEventRequest = asyncHandler(async (req, res) => {
    const {
        title,
        description,
        expectedDate,
        expectedBudget,
        attendees,
        requirements
    } = req.body;

    // Validate required fields
    if (!title || !description || !expectedDate || expectedBudget === undefined || attendees === undefined || !requirements) {
        res.status(400);
        throw new Error('Please provide all required fields');
    }

    // Validate date
    const eventDate = new Date(expectedDate);
    if (isNaN(eventDate.getTime())) {
        res.status(400);
        throw new Error('Please provide a valid date');
    }

    if (eventDate < new Date()) {
        res.status(400);
        throw new Error('Expected date cannot be in the past');
    }

    // Validate budget
    const budget = Number(expectedBudget);
    if (isNaN(budget) || budget <= 0) {
        res.status(400);
        throw new Error('Please provide a valid budget amount (must be greater than 0)');
    }

    // Validate attendees
    const attendeeCount = Number(attendees);
    if (isNaN(attendeeCount) || attendeeCount <= 0 || !Number.isInteger(attendeeCount)) {
        res.status(400);
        throw new Error('Please provide a valid number of attendees (must be a positive integer)');
    }

    try {
        const eventRequest = await EventRequest.create({
            user: req.user._id,
            title: title.trim(),
            description: description.trim(),
            expectedDate: eventDate,
            expectedBudget: budget,
            attendees: attendeeCount,
            requirements: requirements.trim(),
            status: 'pending'
        });

        const populatedRequest = await EventRequest.findById(eventRequest._id)
            .populate('user', 'name email')
            .populate('assignedTo', 'name email');

        res.status(201).json(populatedRequest);
    } catch (error) {
        console.error('Event Request Creation Error:', error);
        res.status(500);
        throw new Error('Failed to create event request. Please try again.');
    }
});

// @desc    Get all event requests (for organizers)
// @route   GET /api/events/requests
// @access  Private/Organizer
const getEventRequests = asyncHandler(async (req, res) => {
    const eventRequests = await EventRequest.find()
        .populate('user', 'name email')
        .populate('assignedTo', 'name email')
        .sort('-createdAt');

    res.json(eventRequests);
});

// @desc    Get user's event requests
// @route   GET /api/events/requests/me
// @access  Private
const getUserEventRequests = asyncHandler(async (req, res) => {
    const eventRequests = await EventRequest.find({ user: req.user._id })
        .populate('assignedTo', 'name email')
        .sort('-createdAt');

    res.json(eventRequests);
});

// @desc    Update event request status
// @route   PUT /api/events/requests/:id
// @access  Private/Organizer
const updateEventRequest = asyncHandler(async (req, res) => {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid request ID');
    }

    const eventRequest = await EventRequest.findById(req.params.id);

    if (!eventRequest) {
        res.status(404);
        throw new Error('Event request not found');
    }

    const { status, assignedTo, comment } = req.body;

    eventRequest.status = status || eventRequest.status;
    if (assignedTo && mongoose.Types.ObjectId.isValid(assignedTo)) {
        eventRequest.assignedTo = assignedTo;
    }

    if (comment) {
        eventRequest.comments.push({
            user: req.user._id,
            text: comment
        });
    }

    const updatedEventRequest = await eventRequest.save();
    const populatedRequest = await EventRequest.findById(updatedEventRequest._id)
        .populate('user', 'name email')
        .populate('assignedTo', 'name email')
        .populate('comments.user', 'name email');

    res.json(populatedRequest);
});

// @desc    Add comment to event request
// @route   POST /api/events/requests/:id/comments
// @access  Private
const addEventRequestComment = asyncHandler(async (req, res) => {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid request ID');
    }

    const eventRequest = await EventRequest.findById(req.params.id);

    if (!eventRequest) {
        res.status(404);
        throw new Error('Event request not found');
    }

    const { text } = req.body;

    if (!text) {
        res.status(400);
        throw new Error('Comment text is required');
    }

    eventRequest.comments.push({
        user: req.user._id,
        text
    });

    const updatedEventRequest = await eventRequest.save();
    const populatedRequest = await EventRequest.findById(updatedEventRequest._id)
        .populate('user', 'name email')
        .populate('assignedTo', 'name email')
        .populate('comments.user', 'name email');

    res.json(populatedRequest);
});

module.exports = {
    createEventRequest,
    getEventRequests,
    getUserEventRequests,
    updateEventRequest,
    addEventRequestComment
}; 