const mongoose = require('mongoose');

const eventRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    expectedDate: {
        type: Date,
        required: true
    },
    expectedBudget: {
        type: Number,
        required: true,
        min: 0
    },
    attendees: {
        type: Number,
        required: true,
        min: 1
    },
    requirements: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        text: String,
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

const EventRequest = mongoose.model('EventRequest', eventRequestSchema);

module.exports = EventRequest; 