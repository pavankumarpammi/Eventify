const express = require('express');
const router = express.Router();
const Event = require('../models/eventModel');
const User = require('../models/userModel');
const { protect, organizer } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for local storage
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Create multer upload instance
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Organizer
router.post('/', protect, organizer, upload.array('images', 5), async (req, res) => {
    try {
        console.log('Request body:', req.body);
        console.log('Uploaded files:', req.files);

        // Validate required fields
        const requiredFields = ['title', 'description', 'category', 'date', 'time', 'location', 'price', 'totalTickets'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: 'Missing required fields',
                fields: missingFields,
                receivedData: req.body
            });
        }

        // Validate files
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                message: 'At least one image is required'
            });
        }

        // Process image paths
        const images = req.files.map(file => `/uploads/${file.filename}`);

        // Create event data
        const eventData = {
            title: req.body.title,
            description: req.body.description,
            category: req.body.category,
            date: new Date(req.body.date),
            time: req.body.time,
            location: req.body.location,
            price: Number(req.body.price),
            totalTickets: Number(req.body.totalTickets),
            availableTickets: Number(req.body.totalTickets),
            images: images,
            organizer: req.user._id,
            isPublished: true,
            status: 'upcoming'
        };

        // Add optional features if provided
        if (req.body.features) {
            try {
                eventData.features = JSON.parse(req.body.features);
            } catch (error) {
                console.error('Error parsing features:', error);
                eventData.features = [];
            }
        }

        console.log('Creating event with data:', eventData);

        // Create and save the event
        const event = new Event(eventData);
        const createdEvent = await event.save();

        // Populate organizer details
        const populatedEvent = await Event.findById(createdEvent._id)
            .populate('organizer', 'name email isOrganizerVerified');

        console.log('Event created successfully:', populatedEvent);
        res.status(201).json(populatedEvent);
    } catch (error) {
        console.error('Error creating event:', error);
        
        // Clean up uploaded files if event creation fails
        if (req.files) {
            req.files.forEach(file => {
                fs.unlink(file.path, err => {
                    if (err) console.error('Error deleting file:', err);
                });
            });
        }

        res.status(500).json({
            message: 'Error creating event',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});

// @desc    Get all events
// @route   GET /api/events
// @access  Public
router.get('/', async (req, res) => {
    try {
        const pageSize = 12;
        const page = Number(req.query.page) || 1;
        const category = req.query.category;
        const searchQuery = req.query.search;

        let query = { isPublished: true };
        if (category) query.category = category;
        if (searchQuery) {
            query.$or = [
                { title: { $regex: searchQuery, $options: 'i' } },
                { description: { $regex: searchQuery, $options: 'i' } },
                { location: { $regex: searchQuery, $options: 'i' } }
            ];
        }

        let events = await Event.find(query)
            .populate('organizer', 'name email isOrganizerVerified')
            .sort({ date: 1, createdAt: -1 });

        // If no events found and no search/category filter, create sample events
        if (events.length === 0 && !category && !searchQuery) {
            const admin = await User.findOne({ role: 'admin' });
            if (admin) {
                const sampleEvents = [
                    {
                        title: "Tech Conference 2024",
                        description: "Join us for the biggest tech conference of the year. Learn about AI, blockchain, and emerging technologies from industry experts. Network with professionals and participate in hands-on workshops.",
                        category: "conference",
                        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                        time: "09:00",
                        location: "Hyderabad International Convention Center",
                        price: 4999,
                        totalTickets: 500,
                        availableTickets: 500,
                        images: ["banner.jpg"],
                        organizer: admin._id,
                        isPublished: true,
                        status: 'upcoming'
                    },
                    {
                        title: "Cultural Music Festival",
                        description: "Experience the rich cultural heritage through a mesmerizing musical evening featuring classical and contemporary artists. Enjoy traditional performances and modern fusion music.",
                        category: "concert",
                        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                        time: "18:30",
                        location: "Phoenix Arena, Mumbai",
                        price: 2999,
                        totalTickets: 1000,
                        availableTickets: 1000,
                        images: ["events.jpg"],
                        organizer: admin._id,
                        isPublished: true,
                        status: 'upcoming'
                    },
                    {
                        title: "Art & Photography Exhibition",
                        description: "Discover extraordinary works of contemporary art and photography. Special guided tours available with opportunities to meet the artists and learn about their creative process.",
                        category: "exhibition",
                        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
                        time: "10:00",
                        location: "National Art Gallery, Delhi",
                        price: 1499,
                        totalTickets: 200,
                        availableTickets: 200,
                        images: ["banner.png"],
                        organizer: admin._id,
                        isPublished: true,
                        status: 'upcoming'
                    }
                ];

                try {
                    await Event.insertMany(sampleEvents);
                    events = await Event.find(query)
                        .populate('organizer', 'name email isOrganizerVerified')
                        .sort({ date: 1, createdAt: -1 });
                } catch (error) {
                    console.error('Error creating sample events:', error);
                }
            }
        }

        // Apply pagination after combining all events
        const startIndex = (page - 1) * pageSize;
        const paginatedEvents = events.slice(startIndex, startIndex + pageSize);
        const count = events.length;

        res.json({
            events: paginatedEvents,
            page,
            pages: Math.ceil(count / pageSize),
            total: count
        });
    } catch (error) {
        console.error('Error in GET /api/events:', error);
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('organizer', 'name email organizerDetails');
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Organizer
router.put('/:id', protect, organizer, upload.array('images', 5), async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to update this event' });
        }

        // Handle new images
        let images = event.images;
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/${file.filename}`);
            images = [...images, ...newImages];
        }

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.id,
            {
                ...req.body,
                images,
                isPublished: true
            },
            { new: true }
        );

        res.json(updatedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Organizer
router.delete('/:id', protect, organizer, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.organizer.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized to delete this event' });
        }

        await event.remove();
        res.json({ message: 'Event removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get organizer events
// @route   GET /api/events/organizer/myevents
// @access  Private/Organizer
router.get('/organizer/myevents', protect, organizer, async (req, res) => {
    try {
        const events = await Event.find({ organizer: req.user._id })
            .sort({ createdAt: -1 });
        res.json(events);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 