import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Register from './pages/Register';
import CreateEvent from './pages/CreateEvent';
import Registrations from './pages/Registrations';

export default function App() {
  return (
    <Router>
      <Navbar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/registrations" element={<Registrations />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="footer">
        <div className="container">
          <p>
            <strong>EVENTNEST</strong> &bull; College Event Registration Platform
          </p>
        </div>
      </footer>
    </Router>
  );
}
