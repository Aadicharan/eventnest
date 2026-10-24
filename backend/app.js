const express = require('express');
const cors = require('cors');
const eventsRoutes = require('./routes/eventsRoutes');
const registrationsRoutes = require('./routes/registrationsRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

// API Info / Health Check
app.get('/api', (req, res) => {
  res.status(200).json({
    project: 'EventNest API',
    description: 'College Event Registration Platform REST Backend',
    endpoints: {
      events: {
        list: 'GET /api/events',
        details: 'GET /api/events/:id',
        create: 'POST /api/events',
      },
      registrations: {
        list: 'GET /api/registrations',
        create: 'POST /api/registrations',
      },
    },
  });
});

// Mount Routes
app.use('/api/events', eventsRoutes);
app.use('/api/registrations', registrationsRoutes);

// Handle unknown API routes (404)
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found.' });
});

// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  res.status(500).json({ message: 'Internal server error occurred.' });
});

module.exports = app;
