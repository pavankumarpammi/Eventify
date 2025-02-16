const express = require('express');
const router = express.Router();
const Order = require('../models/orderModel');
const Event = require('../models/eventModel');
const { protect } = require('../middleware/authMiddleware');

// Generate ticket number
const generateTicketNumber = (orderId, index) => {
    return `TKT-${orderId.toString().slice(-6)}-${(index + 1).toString().padStart(3, '0')}`;
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { eventId, numberOfTickets, billingDetails } = req.body;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        if (event.availableTickets < numberOfTickets) {
            return res.status(400).json({ message: 'Not enough tickets available' });
        }

        const totalAmount = event.price * numberOfTickets;

        // Create order with confirmed status
        const order = new Order({
            user: req.user._id,
            event: eventId,
            numberOfTickets,
            totalAmount,
            status: 'confirmed',
            billingDetails,
            ticketIds: Array.from({ length: numberOfTickets }, (_, i) => generateTicketNumber(event._id, i))
        });

        const createdOrder = await order.save();

        // Update available tickets
        event.availableTickets -= numberOfTickets;
        await event.save();

        // Populate event details for the response
        const populatedOrder = await Order.findById(createdOrder._id)
            .populate('event')
            .populate('user', 'name email');

        res.status(201).json({
            order: populatedOrder,
            tickets: populatedOrder.ticketIds.map((ticketId, index) => ({
                ticketId,
                eventName: event.title,
                eventDate: event.date,
                eventTime: event.time,
                eventLocation: event.location,
                attendeeName: billingDetails.name,
                attendeeEmail: billingDetails.email,
                ticketNumber: index + 1,
                totalTickets: numberOfTickets,
                orderDate: new Date(),
                qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketId}`
            }))
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('event')
            .populate('user', 'name email');

        if (order) {
            if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized' });
            }

            const tickets = order.ticketIds.map((ticketId, index) => ({
                ticketId,
                eventName: order.event.title,
                eventDate: order.event.date,
                eventTime: order.event.time,
                eventLocation: order.event.location,
                attendeeName: order.billingDetails.name,
                attendeeEmail: order.billingDetails.email,
                ticketNumber: index + 1,
                totalTickets: order.numberOfTickets,
                orderDate: order.createdAt,
                qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketId}`
            }));

            res.json({ order, tickets });
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/user/myorders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('event')
            .sort('-createdAt');

        const ordersWithTickets = orders.map(order => ({
            ...order.toObject(),
            tickets: order.ticketIds.map((ticketId, index) => ({
                ticketId,
                eventName: order.event.title,
                eventDate: order.event.date,
                eventTime: order.event.time,
                eventLocation: order.event.location,
                attendeeName: order.billingDetails.name,
                attendeeEmail: order.billingDetails.email,
                ticketNumber: index + 1,
                totalTickets: order.numberOfTickets,
                orderDate: order.createdAt,
                qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticketId}`
            }))
        }));

        res.json(ordersWithTickets);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
router.put('/:id/cancel', protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        if (order.status === 'confirmed') {
            order.status = 'cancelled';
            const updatedOrder = await order.save();

            // Return tickets to available pool
            const event = await Event.findById(order.event);
            if (event) {
                event.availableTickets += order.numberOfTickets;
                await event.save();
            }

            res.json(updatedOrder);
        } else {
            res.status(400).json({ message: 'Order cannot be cancelled' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router; 