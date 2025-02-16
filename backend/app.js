const eventRoutes = require('./routes/eventRoutes');
const eventRequestRoutes = require('./routes/eventRequestRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/events', eventRoutes);
app.use('/api/event-requests', eventRequestRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes); 