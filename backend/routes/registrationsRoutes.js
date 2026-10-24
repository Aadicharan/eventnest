const express = require('express');
const router = express.Router();
const {
  registerStudentForEvent,
  getRegistrations,
} = require('../controllers/registrationsController');

// POST /api/registrations - Register student for an event
router.post('/', registerStudentForEvent);

// GET /api/registrations - List all registrations
router.get('/', getRegistrations);

module.exports = router;
