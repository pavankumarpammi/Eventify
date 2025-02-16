# Event Management System

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for managing events, bookings, and ticket sales. The system supports multiple user roles including public users, event organizers, and administrators.

## Features

### Public Users
- Browse and search events
- Filter events by category
- View event details
- Book event tickets
- View booking history
- Download tickets
- View payment history

### Event Organizers
- Create and manage events
- Upload event images
- Set ticket prices and availability
- View event analytics
- Track ticket sales
- Manage event details
- View revenue statistics

### Administrators
- Approve organizer accounts
- View system analytics
- Monitor all events
- Manage users
- View platform statistics

## Tech Stack

### Frontend
- React.js
- Material-UI
- Redux Toolkit
- React Router
- Axios
- Stripe Payment Integration

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer for file uploads
- Stripe API

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Stripe Account (for payment processing)

## Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd event-management-system
\`\`\`

2. Install dependencies:
\`\`\`bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
\`\`\`

3. Create a .env file in the root directory and add your environment variables:
\`\`\`
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-management
JWT_SECRET=your-secret-key-here
STRIPE_SECRET_KEY=your-stripe-secret-key-here
NODE_ENV=development
\`\`\`

4. Start the development servers:
\`\`\`bash
# Start backend server (from root directory)
npm run server

# Start frontend server (from frontend directory)
npm start
\`\`\`

The application will be available at `http://localhost:3000`

## Default Admin Account

Email: admin@gmail.com
Password: 123456

## API Documentation

### Authentication Routes
- POST /api/users/register - Register a new user
- POST /api/users/login - User login
- GET /api/users/profile - Get user profile
- PUT /api/users/profile - Update user profile

### Event Routes
- GET /api/events - Get all events
- GET /api/events/:id - Get event by ID
- POST /api/events - Create new event (Organizer)
- PUT /api/events/:id - Update event (Organizer)
- DELETE /api/events/:id - Delete event (Organizer)

### Order Routes
- POST /api/orders - Create new order
- GET /api/orders/user/myorders - Get user orders
- GET /api/orders/:id - Get order by ID
- PUT /api/orders/:id/pay - Update order to paid
- PUT /api/orders/:id/cancel - Cancel order

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- Material-UI for the beautiful UI components
- Stripe for payment processing
- MongoDB for the database
- Express.js for the backend framework
- React.js for the frontend framework 