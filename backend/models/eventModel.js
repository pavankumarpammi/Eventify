const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['conference', 'workshop', 'concert', 'exhibition', 'sports', 'other']
    },
    date: {
        type: Date,
        required: true,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    },
    time: {
        type: String,
        required: true,
        default: '09:00'
    },
    location: {
        type: String,
        required: true,
        default: 'To be announced'
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    totalTickets: {
        type: Number,
        required: true,
        default: 100
    },
    availableTickets: {
        type: Number,
        required: true,
        default: function() {
            return this.totalTickets;
        }
    },
    images: [{
        type: String,
        required: true,
        default: ['https://res.cloudinary.com/dcza8oi6q/image/upload/v1707305439/events/default-event.jpg']
    }],
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    features: [{
        name: String,
        description: String
    }],
    isPublished: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Virtual for checking if event is sold out
eventSchema.virtual('isSoldOut').get(function() {
    return this.availableTickets === 0;
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event; 