import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
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

function App() {
  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/events/:id" element={<EventDetails />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
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
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
        </Routes>
      </Container>
    </>
  );
}

export default App; 