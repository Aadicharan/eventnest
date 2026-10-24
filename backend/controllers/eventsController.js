const db = require('../db');

/**
 * GET /api/events
 * Fetch all events with registered count and available seats
 */
const getEvents = async (req, res) => {
  try {
    const queryText = `
      SELECT 
        e.id,
        e.title,
        e.description,
        TO_CHAR(e.date, 'YYYY-MM-DD') AS date,
        e.time,
        e.venue,
        e.max_participants,
        COUNT(r.id)::int AS registered_count,
        GREATEST(0, e.max_participants - COUNT(r.id)::int) AS available_seats,
        (COUNT(r.id)::int >= e.max_participants) AS is_full
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      GROUP BY e.id
      ORDER BY e.date ASC, e.time ASC;
    `;
    const { rows } = await db.query(queryText);
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ message: 'Internal server error while fetching events.' });
  }
};

/**
 * GET /api/events/:id
 * Fetch a single event by ID with capacity status
 */
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const eventId = parseInt(id, 10);

    if (isNaN(eventId)) {
      return res.status(400).json({ message: 'Invalid event ID.' });
    }

    const queryText = `
      SELECT 
        e.id,
        e.title,
        e.description,
        TO_CHAR(e.date, 'YYYY-MM-DD') AS date,
        e.time,
        e.venue,
        e.max_participants,
        COUNT(r.id)::int AS registered_count,
        GREATEST(0, e.max_participants - COUNT(r.id)::int) AS available_seats,
        (COUNT(r.id)::int >= e.max_participants) AS is_full
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE e.id = $1
      GROUP BY e.id;
    `;
    const { rows } = await db.query(queryText, [eventId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    return res.status(500).json({ message: 'Internal server error while fetching event details.' });
  }
};

/**
 * POST /api/events
 * Create a new event
 */
const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, venue, max_participants } = req.body;

    // Validation: Required fields
    if (!title || !description || !date || !time || !venue || max_participants === undefined || max_participants === null) {
      return res.status(400).json({
        message: 'All fields are required: title, description, date, time, venue, and max_participants.'
      });
    }

    // Validation: Positive integer for max_participants
    const parsedCapacity = parseInt(max_participants, 10);
    if (isNaN(parsedCapacity) || parsedCapacity <= 0) {
      return res.status(400).json({
        message: 'Maximum participants must be a positive number greater than 0.'
      });
    }

    const insertQuery = `
      INSERT INTO events (title, description, date, time, venue, max_participants)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING 
        id, 
        title, 
        description, 
        TO_CHAR(date, 'YYYY-MM-DD') AS date, 
        time, 
        venue, 
        max_participants;
    `;
    const { rows } = await db.query(insertQuery, [
      title.trim(),
      description.trim(),
      date,
      time.trim(),
      venue.trim(),
      parsedCapacity
    ]);

    const createdEvent = {
      ...rows[0],
      registered_count: 0,
      available_seats: rows[0].max_participants,
      is_full: false
    };

    return res.status(201).json({
      message: 'Event created successfully.',
      event: createdEvent
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return res.status(500).json({ message: 'Internal server error while creating event.' });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
};
