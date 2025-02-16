import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Events from './components/pages/Events';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import EventDetails from './components/events/EventDetails';
import CreateEvent from './components/events/CreateEvent';
import Dashboard from './components/dashboard/Dashboard';
import OrganizerDashboard from './components/dashboard/OrganizerDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';
import OrganizerRoute from './components/routing/OrganizerRoute';
import Search from './components/pages/Search';
import Calendar from './components/pages/Calendar';
import AboutUs from './components/pages/AboutUs';
import ContactUs from './components/pages/ContactUs';
import OrganizerAnalytics from './components/dashboard/OrganizerAnalytics';
import OrganizerRequests from './components/dashboard/OrganizerRequests';
import CreateEventRequest from './components/pages/CreateEventRequest';
import Settings from './components/pages/Settings';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <>
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events/:id" element={<EventDetails />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/request-event" element={
              <PrivateRoute>
                <CreateEventRequest />
              </PrivateRoute>
            } />
            <Route path="/settings" element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            } />
            
            {/* Organizer Routes */}
            <Route path="/organizer/dashboard" element={
              <OrganizerRoute>
                <OrganizerDashboard />
              </OrganizerRoute>
            } />
            <Route path="/organizer/create-event" element={
              <OrganizerRoute>
                <CreateEvent />
              </OrganizerRoute>
            } />
            <Route path="/organizer/analytics" element={
              <OrganizerRoute>
                <OrganizerAnalytics />
              </OrganizerRoute>
            } />
            <Route path="/organizer/requests" element={
              <OrganizerRoute>
                <OrganizerRequests />
              </OrganizerRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />

            <Route path="/search" element={<Search />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
          </Routes>
        </Container>
      </>
    </LocalizationProvider>
  );
}

export default App; 