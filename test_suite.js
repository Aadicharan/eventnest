/**
 * Comprehensive Automated Test Suite for EventNest Micro Project
 * Tests all 9 required academic criteria:
 * 1. View events
 * 2. View event details
 * 3. Create event
 * 4. Empty form validation
 * 5. Successful registration
 * 6. Duplicate registration
 * 7. Full event
 * 8. REST API response
 * 9. Database relationships
 */

const { Pool } = require('./backend/node_modules/pg');
require('./backend/node_modules/dotenv').config({ path: './backend/.env' });

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : {
      host: process.env.PGHOST || 'localhost',
      port: parseInt(process.env.PGPORT || '5432', 10),
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'eventnest_db',
    };

const pool = new Pool(poolConfig);

const BASE_URL = 'http://localhost:5000/api';

async function runTestSuite() {
  console.log('=================================================================');
  console.log(' EVENTNEST: Comprehensive Academic Verification Test Suite');
  console.log('=================================================================\n');

  let passed = 0;
  let total = 9;

  // -------------------------------------------------------------
  // Test 1: View events (GET /api/events)
  // -------------------------------------------------------------
  console.log('--- Test 1: View Events ---');
  try {
    const res = await fetch(`${BASE_URL}/events`);
    const data = await res.json();
    if (res.status === 200 && Array.isArray(data) && data.length > 0) {
      console.log(`[PASS] GET /api/events returned HTTP 200 with ${data.length} events.`);
      console.log(`       Sample event: "${data[0].title}" (${data[0].available_seats} seats remaining)`);
      passed++;
    } else {
      console.error(`[FAIL] Expected 200 array, got ${res.status}:`, data);
    }
  } catch (err) {
    console.error('[FAIL] Test 1 exception:', err.message);
  }

  // -------------------------------------------------------------
  // Test 2: View event details (GET /api/events/:id)
  // -------------------------------------------------------------
  console.log('\n--- Test 2: View Event Details ---');
  try {
    const res = await fetch(`${BASE_URL}/events/1`);
    const data = await res.json();
    if (res.status === 200 && data.id === 1 && data.venue) {
      console.log(`[PASS] GET /api/events/1 returned HTTP 200 with event "${data.title}" at "${data.venue}".`);
      passed++;
    } else {
      console.error(`[FAIL] Expected 200 with event data, got ${res.status}:`, data);
    }
  } catch (err) {
    console.error('[FAIL] Test 2 exception:', err.message);
  }

  // -------------------------------------------------------------
  // Test 3: Create event (POST /api/events)
  // -------------------------------------------------------------
  console.log('\n--- Test 3: Create Event ---');
  let createdEventId = null;
  try {
    const newEvent = {
      title: 'Full Stack Web Dev Workshop ' + Date.now().toString().slice(-4),
      description: 'Hands-on training session covering React Hook Form, Express API architecture, and PostgreSQL indexing.',
      date: '2026-11-15',
      time: '10:00 AM',
      venue: 'Lab Complex 402',
      max_participants: 25,
    };
    const res = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent),
    });
    const data = await res.json();
    if (res.status === 201 && data.event && data.event.id) {
      createdEventId = data.event.id;
      console.log(`[PASS] POST /api/events created event ID #${createdEventId} with status 201.`);
      passed++;
    } else {
      console.error(`[FAIL] Expected 201 created, got ${res.status}:`, data);
    }
  } catch (err) {
    console.error('[FAIL] Test 3 exception:', err.message);
  }

  // -------------------------------------------------------------
  // Test 4: Empty form validation (Backend & Frontend rules)
  // -------------------------------------------------------------
  console.log('\n--- Test 4: Empty Form Validation ---');
  try {
    // Missing required fields on POST /api/events
    const resEvent = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '' }),
    });
    const dataEvent = await resEvent.json();

    // Missing required fields on POST /api/registrations
    const resReg = await fetch(`${BASE_URL}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ student_name: '' }),
    });
    const dataReg = await resReg.json();

    if (resEvent.status === 400 && resReg.status === 400) {
      console.log(`[PASS] Empty input properly rejected with HTTP 400 Bad Request.`);
      console.log(`       Event validation message: "${dataEvent.message}"`);
      console.log(`       Registration validation message: "${dataReg.message}"`);
      passed++;
    } else {
      console.error(`[FAIL] Expected 400, got ${resEvent.status} and ${resReg.status}`);
    }
  } catch (err) {
    console.error('[FAIL] Test 4 exception:', err.message);
  }

  // -------------------------------------------------------------
  // Test 5: Successful registration (POST /api/registrations)
  // -------------------------------------------------------------
  console.log('\n--- Test 5: Successful Registration ---');
  const uniqueRoll = 'CS2026' + Math.floor(100 + Math.random() * 900);
  const studentData = {
    student_name: 'Tanvi Shinde',
    student_email: `tanvi.${uniqueRoll.toLowerCase()}@college.edu`,
    student_id: uniqueRoll,
    event_id: createdEventId || 1,
  };
  try {
    const res = await fetch(`${BASE_URL}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });
    const data = await res.json();
    if (res.status === 201 && data.registration) {
      console.log(`[PASS] POST /api/registrations registered student ${studentData.student_name} (${studentData.student_id}) with status 201.`);
      passed++;
    } else {
      console.error(`[FAIL] Expected 201, got ${res.status}:`, data);
    }
  } catch (err) {
    console.error('[FAIL] Test 5 exception:', err.message);
  }

  // -------------------------------------------------------------
  // Test 6: Duplicate registration (Expect 409 Conflict)
  // -------------------------------------------------------------
  console.log('\n--- Test 6: Duplicate Registration ---');
  try {
    const res = await fetch(`${BASE_URL}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData),
    });
    const data = await res.json();
    if (res.status === 409 && data.message === 'Student is already registered for this event.') {
      console.log(`[PASS] Duplicate registration rejected with HTTP 409: "${data.message}"`);
      passed++;
    } else {
      console.error(`[FAIL] Expected 409 with exact message, got ${res.status}:`, data);
    }
  } catch (err) {
    console.error('[FAIL] Test 6 exception:', err.message);
  }

  // -------------------------------------------------------------
  // Test 7: Full event (Event 4 has capacity 2 and 2 registrations -> Expect 400 "Event is full.")
  // -------------------------------------------------------------
  console.log('\n--- Test 7: Full Event Handling ---');
  try {
    const res = await fetch(`${BASE_URL}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_name: 'Gaurav Nair',
        student_email: 'gaurav.nair@college.edu',
        student_id: 'ME2023088',
        event_id: 4, // Event 4 is pre-seeded with 2/2 participants
      }),
    });
    const data = await res.json();
    if (res.status === 400 && data.message === 'Event is full.') {
      console.log(`[PASS] Full event registration rejected with HTTP 400: "${data.message}"`);
      passed++;
    } else {
      console.error(`[FAIL] Expected 400 "Event is full.", got ${res.status}:`, data);
    }
  } catch (err) {
    console.error('[FAIL] Test 7 exception:', err.message);
  }

  // -------------------------------------------------------------
  // Test 8: REST API Response Status Codes
  // -------------------------------------------------------------
  console.log('\n--- Test 8: REST API Response & Status Codes ---');
  try {
    // 404 test on non-existent event
    const notFoundRes = await fetch(`${BASE_URL}/events/99999`);
    const notFoundData = await notFoundRes.json();
    
    // GET registrations (200 test)
    const listRegsRes = await fetch(`${BASE_URL}/registrations`);
    const listRegsData = await listRegsRes.json();

    if (notFoundRes.status === 404 && listRegsRes.status === 200 && Array.isArray(listRegsData)) {
      console.log(`[PASS] Status codes verified: 404 for missing resource, 200 for registrations list (${listRegsData.length} records).`);
      passed++;
    } else {
      console.error(`[FAIL] Status code mismatch. 404 got: ${notFoundRes.status}, 200 got: ${listRegsRes.status}`);
    }
  } catch (err) {
    console.error('[FAIL] Test 8 exception:', err.message);
  }

  // -------------------------------------------------------------
  // Test 9: Database Relationships (Foreign Keys & Unique Constraints)
  // -------------------------------------------------------------
  console.log('\n--- Test 9: Database Relationships & Constraints ---');
  try {
    // Check Foreign Keys on registrations table in PostgreSQL catalog
    const fkQuery = `
      SELECT
        tc.table_name, 
        kcu.column_name, 
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
      FROM information_schema.table_constraints AS tc 
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = 'registrations';
    `;
    const fkRes = await pool.query(fkQuery);

    // Check Unique constraint on (student_id, event_id)
    const uqQuery = `
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'registrations' AND constraint_type = 'UNIQUE';
    `;
    const uqRes = await pool.query(uqQuery);

    const hasStudentFk = fkRes.rows.some((r) => r.column_name === 'student_id' && r.foreign_table_name === 'students');
    const hasEventFk = fkRes.rows.some((r) => r.column_name === 'event_id' && r.foreign_table_name === 'events');
    const hasUniqueConstraint = uqRes.rows.some((r) => r.constraint_name === 'unique_student_event');

    if (hasStudentFk && hasEventFk && hasUniqueConstraint) {
      console.log('[PASS] Database relational integrity verified in PostgreSQL catalog:');
      console.log('       - FK: registrations.student_id -> students.id (1 : M)');
      console.log('       - FK: registrations.event_id -> events.id (1 : M)');
      console.log('       - UQ: unique_student_event (prevents duplicate registrations)');
      passed++;
    } else {
      console.error('[FAIL] Missing relational constraints in database schema:', {
        hasStudentFk,
        hasEventFk,
        hasUniqueConstraint,
      });
    }
  } catch (err) {
    console.error('[FAIL] Test 9 exception:', err.message);
  } finally {
    await pool.end();
  }

  console.log('\n=================================================================');
  console.log(` TEST SUMMARY: ${passed} / ${total} Academic Criteria Passed (${Math.round((passed / total) * 100)}%)`);
  console.log('=================================================================\n');
}

runTestSuite().catch(console.error);
