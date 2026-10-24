const db = require('../db');

/**
 * Simple email validation regex
 */
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
};

/**
 * POST /api/registrations
 * Register a student for an event
 * Follows exact academic logic:
 * 1. Check that event exists
 * 2. Check that event is not full
 * 3. Find or create student record
 * 4. Check whether student is already registered
 * 5. Save registration
 */
const registerStudentForEvent = async (req, res) => {
  try {
    const { student_name, student_email, student_id, event_id } = req.body;

    // 1. Basic Input Validation
    if (!student_name || !student_email || !student_id || !event_id) {
      return res.status(400).json({
        message: 'All fields are required: student_name, student_email, student_id, event_id.'
      });
    }

    if (!isValidEmail(student_email)) {
      return res.status(400).json({
        message: 'Please provide a valid email address.'
      });
    }

    const parsedEventId = parseInt(event_id, 10);
    if (isNaN(parsedEventId)) {
      return res.status(400).json({
        message: 'Invalid event ID.'
      });
    }

    const cleanName = student_name.trim();
    const cleanEmail = student_email.trim().toLowerCase();
    const cleanStudentId = student_id.trim().toUpperCase();

    // 2. Check that the event exists and check capacity
    const eventQuery = `
      SELECT 
        e.id, 
        e.title, 
        e.max_participants, 
        COUNT(r.id)::int AS current_count
      FROM events e
      LEFT JOIN registrations r ON e.id = r.event_id
      WHERE e.id = $1
      GROUP BY e.id;
    `;
    const eventResult = await db.query(eventQuery, [parsedEventId]);

    if (eventResult.rows.length === 0) {
      return res.status(404).json({
        message: 'Event not found.'
      });
    }

    const event = eventResult.rows[0];

    // Check if event is full
    if (event.current_count >= event.max_participants) {
      return res.status(400).json({
        message: 'Event is full.'
      });
    }

    // 3. Find or create the student record
    let studentPk;
    const findStudentQuery = `
      SELECT id, name, email, student_id 
      FROM students 
      WHERE student_id = $1 OR email = $2;
    `;
    const studentResult = await db.query(findStudentQuery, [cleanStudentId, cleanEmail]);

    if (studentResult.rows.length > 0) {
      studentPk = studentResult.rows[0].id;
    } else {
      // Insert new student
      const insertStudentQuery = `
        INSERT INTO students (name, email, student_id)
        VALUES ($1, $2, $3)
        RETURNING id;
      `;
      const newStudentResult = await db.query(insertStudentQuery, [
        cleanName,
        cleanEmail,
        cleanStudentId
      ]);
      studentPk = newStudentResult.rows[0].id;
    }

    // 4. Check whether the student is already registered for this event
    const checkDuplicateQuery = `
      SELECT id FROM registrations 
      WHERE student_id = $1 AND event_id = $2;
    `;
    const duplicateResult = await db.query(checkDuplicateQuery, [studentPk, parsedEventId]);

    if (duplicateResult.rows.length > 0) {
      return res.status(409).json({
        message: 'Student is already registered for this event.'
      });
    }

    // 5. If valid, save the registration
    const insertRegQuery = `
      INSERT INTO registrations (student_id, event_id, registered_at)
      VALUES ($1, $2, NOW())
      RETURNING id, student_id, event_id, registered_at;
    `;
    const newRegResult = await db.query(insertRegQuery, [studentPk, parsedEventId]);
    const savedReg = newRegResult.rows[0];

    return res.status(201).json({
      message: 'Registration successful!',
      registration: {
        id: savedReg.id,
        student_id: cleanStudentId,
        student_name: cleanName,
        student_email: cleanEmail,
        event_id: parsedEventId,
        event_title: event.title,
        registered_at: savedReg.registered_at
      }
    });

  } catch (error) {
    // Catch unique constraint violation in database if race condition occurred
    if (error.code === '23505') {
      return res.status(409).json({
        message: 'Student is already registered for this event.'
      });
    }
    console.error('Error during registration:', error);
    return res.status(500).json({
      message: 'Internal server error while processing registration.'
    });
  }
};

/**
 * GET /api/registrations
 * Retrieve all registrations with student and event details
 */
const getRegistrations = async (req, res) => {
  try {
    const queryText = `
      SELECT 
        r.id,
        r.registered_at,
        s.id AS student_pk,
        s.name AS student_name,
        s.email AS student_email,
        s.student_id,
        e.id AS event_id,
        e.title AS event_title,
        TO_CHAR(e.date, 'YYYY-MM-DD') AS event_date,
        e.time AS event_time,
        e.venue AS event_venue
      FROM registrations r
      JOIN students s ON r.student_id = s.id
      JOIN events e ON r.event_id = e.id
      ORDER BY r.registered_at DESC;
    `;
    const { rows } = await db.query(queryText);
    return res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching registrations:', error);
    return res.status(500).json({
      message: 'Internal server error while fetching registrations.'
    });
  }
};

module.exports = {
  registerStudentForEvent,
  getRegistrations,
};
