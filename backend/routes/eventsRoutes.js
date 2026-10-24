const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
} = require('../controllers/eventsController');

// GET /api/events - List all events
router.get('/', getEvents);

// GET /api/events/:id - Get single event details
router.get('/:id', getEventById);

// POST /api/events - Create new event
router.post('/', createEvent);

module.exports = router;
