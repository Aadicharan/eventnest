# EventNest — Complete Guide

*Installation manual • User manual • Developer guide • Internal-assessment reference • Viva handbook*

> **Student:** Aadi Charan (AU2024BCSE109)  
> **Institution:** Alliance School of Advanced Computing, Alliance University, Bengaluru  
> **Academic Year:** 2026–2027  
> **Course Submissions:** Back-End Web Development • Full Stack Web Development • Advanced Database Systems  

---

## Contents
1. Project Introduction & Problem Statement
2. Subject Coverage & Academic Mapping
3. Technology Stack & Why Each Was Chosen
4. Prerequisites & Installation on Windows
5. How to Run the Project (Terminal Commands)
6. Complete Folder & File Structure Explanation
7. Application Architecture & High-Level Data Flow
8. Database Design, Relational Constraints & Normalization (1NF–BCNF)
9. Backend & REST API Reference
10. Frontend Architecture & React Component Hierarchy
11. Complete Code Walkthrough
12. Testing, Verification & Real Evidence
13. Troubleshooting Common Issues
14. Step-by-Step Demonstration Guide for Mentors
15. Viva Voce Preparation Handbook (30+ Q&A)
16. Quick Revision Cheat Sheet

---

## Verification & Integrity Status (Read Honestly)

| Verification Criterion | Status | Evidence & Verification Method |
|---|---|---|
| PostgreSQL 18 Relational Schema | ✅ Verified | `database/schema.sql` creates `students`, `events`, and `registrations` with PK, FK, UNIQUE, and CHECK constraints. |
| Database Seed Data | ✅ Verified | `database/seed.sql` populates 5 students, 4 events, and initial registrations (including pre-filling Event 4 to test "Event is Full"). |
| Backend Server Startup | ✅ Verified | `backend/server.js` verifies DB connection with `SELECT NOW()` before listening on port 5000. |
| Dynamic Seat Calculation | ✅ Verified | Computed dynamically via `LEFT JOIN` and `COUNT(r.id)` with `GREATEST(0, max_participants - COUNT)`. |
| Defensive Validation | ✅ Verified | Rejects empty strings, invalid emails, and non-positive participant limits with `HTTP 400 Bad Request`. |
| Duplicate Registration Prevention | ✅ Verified | Dual-layer protection: application check + PostgreSQL `unique_student_event` constraint returning `HTTP 409 Conflict`. |
| Full Event Capacity Enforcement | ✅ Verified | Blocks sign-ups when `registered_count >= max_participants` returning `HTTP 400 Bad Request ("Event is full.")`. |
| Foreign Key Referential Integrity | ✅ Verified | `ON DELETE CASCADE` verified in PostgreSQL system catalog (`information_schema`). |
| Automated Test Suite | ✅ Verified | `node test_suite.js` executes 9 automated checks with a **100% pass rate (9/9 criteria passed)**. |
| React 19 Frontend Production Build | ✅ Verified | `npm run build` in `frontend/` succeeds with zero errors in 236ms. |
| End-to-End Browser Flow | ✅ Verified | Tested via Chromium/Edge on `http://localhost:5173` across all 6 views with genuine screenshots saved to `screenshots/`. |
| Postman Collection | ✅ Verified | Valid v2.1.0 collection included in `postman/EventNest_API.postman_collection.json`. |

---

# Section 1: Project Introduction & Problem Statement

## 1.1 Project Title & Overview
**EventNest** is a full-stack college event registration platform designed to organize campus workshops, hackathons, and seminars while maintaining strict seating limits, student credential validation, and attendance logs.

## 1.2 The Problem
In college campuses, event registrations are commonly handled through informal messaging groups, paper sign-up sheets, or generic forms without live capacity caps:
- **Overbooking:** Popular workshops exceed classroom capacity because forms do not cap responses in real-time.
- **Duplicate Registrations:** Students submit multiple times, skewing attendance numbers and blocking peers.
- **Scattered Records:** Attendance data is separated across multiple files without relational integrity.

## 1.3 The Solution
EventNest provides a centralized web application backed by a relational database:
1. Students can browse upcoming campus events and see live remaining seat counts.
2. Students can register with their name, email, roll number, and selected event.
3. If an event reaches capacity, the application immediately blocks further sign-ups and displays an "Event Full" badge.
4. If a student attempts to register twice for the same event, the system detects and rejects the duplicate.
5. Administrators can publish new campus events and review real-time registration logs.

---

# Section 2: Subject Coverage & Academic Mapping

EventNest was designed to fulfill the micro-project requirements across three distinct computer science subjects:

### A. Back-End Web Development
- Express.js application configuration (`backend/app.js`) and HTTP server lifecycle (`backend/server.js`).
- RESTful routing conventions (`routes/eventsRoutes.js`, `routes/registrationsRoutes.js`).
- Layered controller pattern (`controllers/eventsController.js`, `controllers/registrationsController.js`).
- Defensive input validation, string sanitization, and regex email checking.
- Centralized error handling middleware and standard HTTP status codes (`200`, `201`, `400`, `404`, `409`, `500`).
- Parameterized SQL execution to prevent SQL injection vulnerabilities.
- Connection pooling using `pg.Pool` (`backend/db/index.js`).

### B. Full Stack Web Development
- Component-driven frontend architecture using React 19 and Vite.
- Declarative client-side routing using React Router DOM (`<BrowserRouter>`, `<Routes>`, `<Route>`).
- URL query string synchronization (`useSearchParams`) to pre-select events from the catalog.
- State management and side-effects handling using React Hooks (`useState`, `useEffect`).
- Form handling and validation feedback using React Hook Form.
- Centralized API service layer (`frontend/src/services/api.js`) communicating over HTTP/JSON.
- Vite development proxy routing `/api` requests to backend port 5000.
- User feedback through responsive, dismissible alert banners (`components/Alert.jsx`).

### C. Advanced Database Systems (ADBMS)
- Relational schema modeling in PostgreSQL 18 (`database/schema.sql`).
- Resolution of Many-to-Many (M:N) relationships using an associative bridge table (`registrations`).
- Referential integrity enforcement with `ON DELETE CASCADE`.
- Data domain constraints: `SERIAL PRIMARY KEY`, `UNIQUE`, `CHECK (max_participants > 0)`, `NOT NULL`.
- Formal normalization from 1NF through BCNF.
- Complex multi-table `JOIN` and aggregate queries (`COUNT()`, `LEFT JOIN`, `GROUP BY`, `GREATEST()`).
- Secondary B-Tree index optimization on foreign keys (`student_id`, `event_id`).
- Relational catalog verification in `information_schema`.

---

# Section 3: Technology Stack & Why Each Was Chosen

| Technology | Layer | Version | Why Chosen |
|---|---|---|---|
| **Node.js** | Backend Runtime | v24/v25 LTS | Event-driven, asynchronous non-blocking I/O ideal for concurrent web traffic. |
| **Express.js** | Web Framework | v4.21.2 | Minimalist, unopinionated routing and middleware pipeline. |
| **PostgreSQL** | Relational Database | 18.x | Robust ACID compliance, strong constraint enforcement, and advanced indexing. |
| **node-postgres (`pg`)** | DB Driver | v8.13.1 | Efficient connection pooling and native parameterized query execution. |
| **React** | Frontend Library | v19.2.8 | Declarative component model, fast virtual DOM reconciliation, and rich hook ecosystem. |
| **Vite** | Build Tool | v8.3.1 | Lightning-fast development server with Hot Module Replacement and compact bundling. |
| **React Router DOM** | Client Routing | v7.18.4 | Smooth SPA page transitions without browser page reloads. |
| **React Hook Form** | Form Management | v7.89.0 | Minimal re-renders, intuitive validation rules, and built-in error states. |
| **Vanilla CSS** | Styling System | CSS3 | Lightweight, highly readable custom properties with zero external CSS library bloat. |

---

# Section 4: Prerequisites & Installation on Windows

### 1. Prerequisites
- **Node.js 20+ LTS** (Download from https://nodejs.org)
- **PostgreSQL 16+** (Download from https://www.postgresql.org/download/windows/)
- **Git** (Optional, for version control)

### 2. Verify Installations in PowerShell
```powershell
node -v
npm -v
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" --version
```

### 3. Database Setup in PostgreSQL
Open PowerShell or pgAdmin and run:
```powershell
# 1. Connect to PostgreSQL and create the database
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE eventnest_db;"

# 2. Apply the schema
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d eventnest_db -f "database\schema.sql"

# 3. Insert seed data
& "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d eventnest_db -f "database\seed.sql"
```

---

# Section 5: How to Run the Project (Terminal Commands)

### Terminal 1: Start Backend API (Port 5000)
```powershell
cd "c:\Users\C N Aadicharan\Pictures\Event nest\backend"

# If first time, copy .env.example to .env and configure credentials:
Copy-Item .env.example .env

# Install backend dependencies (if needed)
npm install

# Start the server
npm start
```
*Expected terminal output:*
```
Connected to PostgreSQL database at localhost:5432
Database: eventnest_db
EventNest backend server running on http://localhost:5000
```

### Terminal 2: Start Frontend Application (Port 5173)
```powershell
cd "c:\Users\C N Aadicharan\Pictures\Event nest\frontend"

# Install frontend dependencies (if needed)
npm install

# Start the Vite development server
npm run dev
```
*Expected terminal output:*
```
  VITE v8.3.1  ready in 250 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open your browser at **`http://localhost:5173`**.

---

# Section 6: Complete Folder & File Structure Explanation

```
Event nest/
│
├── .gitignore                    # Excludes node_modules, local .env files, and build caches
├── README.md                     # Root project documentation and setup instructions
├── EventNest_Complete_Guide.md   # This comprehensive master guide
├── test_suite.js                 # Automated academic verification suite (9 criteria)
├── generate_er.ps1               # PowerShell System.Drawing script generating the ER diagram
│
├── database/
│   ├── schema.sql                # DDL script defining students, events, registrations & constraints
│   └── seed.sql                  # DML script inserting realistic campus events and students
│
├── backend/
│   ├── .env                      # Local environment configuration (IGNORED in Git/Submissions)
│   ├── .env.example              # Template environment configuration with placeholder values
│   ├── package.json              # Node.js backend configuration and dependencies
│   ├── package-lock.json         # Exact dependency lockfile
│   ├── server.js                 # Server entry point; runs DB pre-flight check before listening
│   ├── app.js                    # Express app setup, CORS, JSON parsing, routes, and error handling
│   ├── test_api.js               # Quick REST API verification script testing all endpoints
│   ├── db/
│   │   └── index.js              # PostgreSQL connection pool configuration using pg.Pool
│   ├── routes/
│   │   ├── eventsRoutes.js       # Route mappings for /api/events
│   │   └── registrationsRoutes.js# Route mappings for /api/registrations
│   └── controllers/
│       ├── eventsController.js   # Handlers for listing events, event lookup, and event creation
│       └── registrationsController.js # Handlers for student registration & duplicate checking
│
├── frontend/
│   ├── index.html                # HTML entry document
│   ├── vite.config.js            # Vite configuration with /api development proxy to port 5000
│   ├── package.json              # React 19 dependencies and scripts
│   ├── package-lock.json         # Exact frontend lockfile
│   └── src/
│       ├── main.jsx              # React mounting root
│       ├── App.jsx               # Master component with BrowserRouter and navigation layout
│       ├── index.css             # Unified CSS design tokens, cards, badges, and forms
│       ├── services/
│       │   └── api.js            # Centralized API service layer connecting to Express
│       ├── components/
│       │   ├── Navbar.jsx        # Navigation header with active links and brand logo
│       │   ├── EventCard.jsx     # Reusable event card with live seat availability badges
│       │   └── Alert.jsx         # Dismissible color-coded status alerts (success, error, info)
│       └── pages/
│           ├── Home.jsx          # Landing page with hero banner and quick links
│           ├── Events.jsx        # Complete campus events catalog with card grid
│           ├── EventDetails.jsx  # In-depth event details with date, venue, and registration CTA
│           ├── CreateEvent.jsx   # Form for organizers to publish new events
│           ├── Register.jsx      # Student registration form with event dropdown and validation
│           └── Registrations.jsx # Tabular roster displaying all confirmed registrations
│
├── docs/
│   ├── alliance_logo.png         # Authentic Alliance University crest logo
│   └── er-diagram.png            # High-resolution relational ER diagram
│
├── postman/
│   └── EventNest_API.postman_collection.json # Complete Postman test collection
│
├── screenshots/                  # 11 genuine screenshots of the running application
│   ├── output_1_home_dashboard.png
│   ├── output_2_events_catalog.png
│   ├── output_3_event_details.png
│   ├── output_4_create_event_form.png
│   ├── output_5_registration_page.png
│   ├── output_6_registration_validation.png
│   ├── output_7_duplicate_registration_alert.png
│   ├── output_8_full_event_alert.png
│   ├── output_9_successful_registration.png
│   ├── output_10_registrations_table.png
│   └── output_11_api_health_endpoint.png
│
└── reports/                      # 3 official Alliance University submission reports
    ├── Backend_Report.pdf
    ├── FullStack_Report.pdf
    └── ADBMS_Report.pdf
```

---

# Section 7: Application Architecture & High-Level Data Flow

```
[ Web Browser Client ]
       │
       ▼
[ React 19 Frontend (Port 5173) ]
  • React Router DOM (Navigation)
  • React Hook Form (Client Validation)
  • Centralized api.js (Fetch)
       │
       │ HTTP / JSON
       ▼
[ Express.js REST Backend (Port 5000) ]
  • CORS & JSON Body Parser
  • Request Logging Middleware
  • Router Tier (eventsRoutes, registrationsRoutes)
  • Controller Tier (eventsController, registrationsController)
  • Parameter Sanitization & Business Rules
       │
       │ Parameterized Queries ($1, $2) via pg.Pool
       ▼
[ PostgreSQL 18 Database (Port 5432) ]
  • Schema Catalog & Relational Tables (students, events, registrations)
  • Primary Keys, Foreign Keys (ON DELETE CASCADE)
  • Composite UNIQUE Constraint (student_id, event_id)
  • Domain CHECK Constraint (max_participants > 0)
  • Dynamic Aggregate Computations (LEFT JOIN, COUNT, GREATEST)
```

---

# Section 8: Database Design, Relational Constraints & Normalization

## 8.1 Table Specifications

### 1. `students` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | Auto-incrementing unique identifier. |
| `name` | `VARCHAR(100)` | `NOT NULL` | Student full name. |
| `email` | `VARCHAR(120)` | `NOT NULL UNIQUE` | Official college email address. |
| `student_id` | `VARCHAR(50)` | `NOT NULL UNIQUE` | Student registration number / roll code. |

### 2. `events` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | Auto-incrementing unique event ID. |
| `title` | `VARCHAR(200)` | `NOT NULL` | Event title or workshop name. |
| `description` | `TEXT` | `NOT NULL` | Detailed event agenda and overview. |
| `date` | `DATE` | `NOT NULL` | Scheduled event date. |
| `time` | `VARCHAR(50)` | `NOT NULL` | Start time (e.g. "10:00 AM"). |
| `venue` | `VARCHAR(150)` | `NOT NULL` | Campus hall or laboratory location. |
| `max_participants` | `INT` | `NOT NULL CHECK (> 0)` | Maximum allowed seating capacity. |

### 3. `registrations` Table (Bridge Table)
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | `SERIAL` | `PRIMARY KEY` | Auto-incrementing registration identifier. |
| `student_id` | `INT` | `NOT NULL REFERENCES students(id) ON DELETE CASCADE` | Foreign key referencing the attendee. |
| `event_id` | `INT` | `NOT NULL REFERENCES events(id) ON DELETE CASCADE` | Foreign key referencing the event. |
| `registered_at` | `TIMESTAMP` | `NOT NULL DEFAULT CURRENT_TIMESTAMP` | System timestamp of registration. |
| — | `CONSTRAINT` | `UNIQUE (student_id, event_id)` | Composite key preventing duplicate sign-ups. |

## 8.2 Normalization Proof
1. **1NF (Atomic Values):** Every cell holds an indivisible scalar; no nested arrays or repeating groups exist.
2. **2NF (No Partial Key Dependencies):** In `students` and `events`, primary keys are single-column serials. In `registrations`, non-key `registered_at` depends on the full composite candidate key `(student_id, event_id)`.
3. **3NF (No Transitive Dependencies):** Non-prime attributes depend only on candidate keys; venue does not determine capacity, and student name does not determine email.
4. **BCNF (Superkey Determinants):** For every functional dependency $X \rightarrow Y$, $X$ is a candidate key.

---

# Section 9: Backend & REST API Reference

All requests accept and return `application/json`. Base URL: `http://localhost:5000/api`.

### 1. Root Health Check & Discovery
- **Route:** `GET /api`
- **Status:** `200 OK`
- **Response:**
```json
{
  "project": "EventNest API",
  "description": "College Event Registration Platform REST Backend",
  "endpoints": {
    "events": { "list": "GET /api/events", "details": "GET /api/events/:id", "create": "POST /api/events" },
    "registrations": { "list": "GET /api/registrations", "create": "POST /api/registrations" }
  }
}
```

### 2. List Events with Capacity Metrics
- **Route:** `GET /api/events`
- **Status:** `200 OK`
- **Response:** Array of event objects with `registered_count`, `available_seats`, and `is_full` boolean flag.

### 3. Get Event Details
- **Route:** `GET /api/events/:id`
- **Status:** `200 OK` (or `404 Not Found` if nonexistent)

### 4. Create Campus Event
- **Route:** `POST /api/events`
- **Body:**
```json
{
  "title": "Cloud Computing Workshop",
  "description": "Hands-on containerization and CI/CD training.",
  "date": "2026-11-20",
  "time": "10:00 AM",
  "venue": "Lab 402",
  "max_participants": 35
}
```
- **Status:** `201 Created` (or `400 Bad Request` if fields missing/invalid)

### 5. Register Student for Event
- **Route:** `POST /api/registrations`
- **Body:**
```json
{
  "student_name": "Aadi Charan",
  "student_email": "aadi.charan@college.edu",
  "student_id": "AU2024BCSE109",
  "event_id": 1
}
```
- **Possible Responses:**
  - `201 Created`: Registration confirmed.
  - `400 Bad Request`: Missing fields or "Event is full."
  - `409 Conflict`: "Student is already registered for this event."

### 6. List All Registrations
- **Route:** `GET /api/registrations`
- **Status:** `200 OK`
- **Response:** Array of registration objects joined with student names, roll numbers, and event titles.

---

# Section 10: Frontend Architecture & React Component Hierarchy

### Page Flow
1. **Home (`/`):** Welcomes the student with a hero banner, key system stats, and quick links.
2. **Events Catalog (`/events`):** Renders responsive cards for all events. Cards display real-time availability badges ("Available" vs "Full").
3. **Event Details (`/events/:id`):** Displays detailed description, date, timing, and venue, with a direct CTA to register.
4. **Create Event (`/create-event`):** Provides a validated form for organizers to publish new campus events.
5. **Register (`/register`):** Student registration form with event pre-selection via query parameter (`?eventId=1`), inline validation, and duplicate/full event error alerts.
6. **Registrations (`/registrations`):** An administrative audit table showing student registrations sorted chronologically.

---

# Section 11: Complete Code Walkthrough

### 1. Pre-Flight Database Check (`backend/server.js`)
Ensures the server never runs if PostgreSQL is down:
```javascript
db.query('SELECT NOW()')
  .then((res) => {
    app.listen(PORT, () => {
      console.log(`EventNest backend server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to PostgreSQL database:', err.message);
    process.exit(1);
  });
```

### 2. Dual-Layer Duplicate Check (`backend/controllers/registrationsController.js`)
```javascript
// Step 4: Check duplicate in application
const checkDuplicateQuery = `SELECT id FROM registrations WHERE student_id = $1 AND event_id = $2;`;
const duplicateResult = await db.query(checkDuplicateQuery, [studentPk, parsedEventId]);

if (duplicateResult.rows.length > 0) {
  return res.status(409).json({ message: 'Student is already registered for this event.' });
}
```

### 3. Centralized API Fetch (`frontend/src/services/api.js`)
```javascript
async function handleResponse(response) {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const error = (data && data.message) || `HTTP error! Status: ${response.status}`;
    const errObj = new Error(error);
    errObj.status = response.status;
    errObj.data = data;
    throw errObj;
  }
  return data;
}
```

---

# Section 12: Testing, Verification & Real Evidence

Run the automated test suite in the project root:
```powershell
node test_suite.js
```

### Official Automated Test Results
```
=================================================================
 EVENTNEST: Comprehensive Academic Verification Test Suite
=================================================================

--- Test 1: View Events ---
[PASS] GET /api/events returned HTTP 200 with 5 events.
       Sample event: "Workshop on Git & Open Source" (0 seats remaining)

--- Test 2: View Event Details ---
[PASS] GET /api/events/1 returned HTTP 200 with event "HackNest 2026: Annual College Hackathon" at "Main Auditorium & Tech Lab 1".

--- Test 3: Create Event ---
[PASS] POST /api/events created event ID #6 with status 201.

--- Test 4: Empty Form Validation ---
[PASS] Empty input properly rejected with HTTP 400 Bad Request.
       Event validation message: "All fields are required: title, description, date, time, venue, and max_participants."
       Registration validation message: "All fields are required: student_name, student_email, student_id, event_id."

--- Test 5: Successful Registration ---
[PASS] POST /api/registrations registered student Tanvi Shinde (CS2026125) with status 201.

--- Test 6: Duplicate Registration ---
[PASS] Duplicate registration rejected with HTTP 409: "Student is already registered for this event."

--- Test 7: Full Event Handling ---
[PASS] Full event registration rejected with HTTP 400: "Event is full."

--- Test 8: REST API Response & Status Codes ---
[PASS] Status codes verified: 404 for missing resource, 200 for registrations list (9 records).

--- Test 9: Database Relationships & Constraints ---
[PASS] Database relational integrity verified in PostgreSQL catalog:
       - FK: registrations.student_id -> students.id (1 : M)
       - FK: registrations.event_id -> events.id (1 : M)
       - UQ: unique_student_event (prevents duplicate registrations)

=================================================================
 TEST SUMMARY: 9 / 9 Academic Criteria Passed (100%)
=================================================================
```

---

# Section 13: Troubleshooting Common Issues

### 1. `ECONNREFUSED` on port 5432
- **Cause:** PostgreSQL service is stopped.
- **Fix:** Start PostgreSQL using PowerShell:
  ```powershell
  Start-Process "C:\Program Files\PostgreSQL\18\bin\postgres.exe" -ArgumentList '-D "C:\Program Files\PostgreSQL\18\data"'
  ```

### 2. Port 5000 Already in Use
- **Cause:** Another node process or server is listening on port 5000.
- **Fix:** Identify and stop the process:
  ```powershell
  Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
  ```

### 3. Vite Displays Network Error when Calling `/api`
- **Cause:** Backend server on port 5000 is not running.
- **Fix:** Verify backend is active by visiting `http://localhost:5000/api` in your browser.

---

# Section 14: Step-by-Step Demonstration Guide for Mentors

When demonstrating EventNest to your mentor or examiner, follow this 5-minute walkthrough:

1. **Show Server Startup (1 min):**
   - Open PowerShell in `backend/` and start with `npm start`. Point out the `Connected to PostgreSQL database at localhost:5432` verification log.
2. **Show Home Dashboard & Catalog (1 min):**
   - Open `http://localhost:5173`. Show the hero banner, click "Browse Events", and show how seat counts are computed dynamically from PostgreSQL. Point out that "Workshop on Git & Open Source" has an "Event Full" badge.
3. **Demonstrate Defensive Validation (1 min):**
   - Navigate to `/register`. Click "Confirm Registration" on an empty form. Show the immediate red validation messages.
4. **Demonstrate Duplicate Prevention (1 min):**
   - Select Event 1 ("HackNest 2026") and enter Rahul Sharma's credentials (`CS2023001`). Click submit. Show the red banner: *"Student is already registered for this event."* (HTTP 409).
5. **Demonstrate Full Capacity Enforcement (1 min):**
   - Select Event 4 ("Workshop on Git & Open Source"). Try to register. Show the red banner: *"Event is full."* (HTTP 400).
6. **Demonstrate Successful Registration & Roster (1 min):**
   - Register a new student for an open event. Show the green confirmation summary card. Then click "Registrations" in the navbar to show the newly inserted row in the database audit roster.
7. **Show Automated Test Suite (30 sec):**
   - Run `node test_suite.js` in terminal to show 9/9 automated criteria passing.

---

# Section 15: Viva Voce Preparation Handbook (30+ Q&A)

### General & Architecture
**Q1: What is EventNest and what problem does it solve?**  
*Answer:* EventNest is a full-stack college event registration system. It solves the problem of event overbooking, duplicate participant sign-ups, and disconnected spreadsheets by providing a centralized React interface backed by a relational PostgreSQL database and an Express REST API.

**Q2: Why did you choose a decoupled SPA architecture instead of server-rendered pages (like EJS)?**  
*Answer:* A decoupled Single Page Application separates concerns: the frontend handles UI rendering and user interactions smoothly without full-page reloads, while the backend focuses purely on business logic, validation, and database operations through a standardized JSON REST API.

### Back-End Web Development
**Q3: How does Node.js handle multiple requests with a single thread?**  
*Answer:* Node.js uses an event loop with non-blocking, asynchronous I/O. When a database query or network request is initiated, Node delegates the waiting to the operating system kernel and continues executing other code. Once the I/O completes, the callback or promise resolution is placed on the event queue and processed.

**Q4: What is the difference between `app.js` and `server.js` in your project?**  
*Answer:* `app.js` configures the Express application instance, attaches middlewares (CORS, JSON parser), and mounts route modules. `server.js` imports `app`, checks the PostgreSQL database connection using `SELECT NOW()`, and starts the HTTP server listening on the configured port. This separation also makes testing easier.

**Q5: What HTTP status codes does EventNest use and why?**  
*Answer:*  
- `200 OK`: Successful retrieval of events or registrations.  
- `201 Created`: Successful creation of an event or registration record.  
- `400 Bad Request`: Missing required fields, invalid email format, or event is full.  
- `404 Not Found`: Event ID does not exist in the database.  
- `409 Conflict`: Student is already registered for that event.  
- `500 Internal Server Error`: Unhandled server or database exceptions.

**Q6: How do you prevent SQL injection in EventNest?**  
*Answer:* By never concatenating user input directly into SQL strings. We use parameterized queries with `$1, $2, ...` placeholders provided by the `pg` library. PostgreSQL treats the bound parameters strictly as literal data values, making SQL injection impossible.

**Q7: Why do you use connection pooling (`pg.Pool`) instead of single client connections?**  
*Answer:* Creating a new database connection for every request is expensive because of TCP handshakes and authentication overhead. Connection pooling maintains a pool of warm, reusable connections that can be borrowed and returned immediately, improving server throughput.

### Full Stack Web Development
**Q8: How does React Router work without reloading the page?**  
*Answer:* React Router intercepts anchor link clicks and modifies the browser's URL using the HTML5 History API (`pushState`). It then re-renders the matching component inside the Virtual DOM without making a fresh GET request to the web server for a new HTML document.

**Q9: How do you pre-select an event in the registration form when coming from an event card?**  
*Answer:* When the user clicks "Register" on an event card, the URL passes `?eventId=...` as a query parameter. The `Register.jsx` component reads this query parameter using the `useSearchParams` hook and calls `setValue('event_id', id)` from React Hook Form inside a `useEffect` hook.

**Q10: Why did you use React Hook Form instead of managing inputs with standard `useState`?**  
*Answer:* React Hook Form minimizes unnecessary component re-renders during keystrokes, provides built-in validation rules (e.g. required, minLength, pattern regex), and handles error states and submission flags (`isSubmitting`) cleanly with minimal boilerplate.

**Q11: How does the frontend handle API errors from the backend?**  
*Answer:* In `services/api.js`, the helper function `handleResponse` checks `response.ok`. If false, it extracts the JSON `message` returned by the Express controller and throws an `Error` object. The UI component catches this error and passes the message to `components/Alert.jsx`, which renders a user-friendly red alert banner.

### Advanced Database Systems (ADBMS)
**Q12: What tables exist in EventNest and what are their relationships?**  
*Answer:* There are three tables: `students`, `events`, and `registrations`. Students and events have a Many-to-Many (M:N) relationship because one student can register for multiple events, and one event can have multiple attendees. The `registrations` table acts as an associative entity (bridge table) with foreign keys to both `students.id` and `events.id`, decomposing the M:N into two 1:M relationships.

**Q13: How is seat capacity calculated in the database?**  
*Answer:* Instead of storing a mutable remaining seats counter, we compute it on the fly using a SQL aggregate query:  
`COUNT(r.id)::int AS registered_count`  
`GREATEST(0, e.max_participants - COUNT(r.id)::int) AS available_seats`  
`LEFT JOIN registrations r ON e.id = r.event_id GROUP BY e.id`  
Using `LEFT JOIN` ensures events with zero registrations are still included.

**Q14: What is `ON DELETE CASCADE` and why did you use it?**  
*Answer:* `ON DELETE CASCADE` is a referential action on foreign keys. When a row in the parent table (`students` or `events`) is deleted, PostgreSQL automatically deletes all corresponding rows in the child table (`registrations`), preventing orphaned foreign key references.

**Q15: How does the database guarantee that a student cannot register twice for the same event?**  
*Answer:* In `database/schema.sql`, we define a composite unique constraint:  
`CONSTRAINT unique_student_event UNIQUE (student_id, event_id)`  
If an insertion with the same student ID and event ID is attempted, PostgreSQL immediately aborts the query with error code `23505` (unique violation).

**Q16: In what normal form is your database schema?**  
*Answer:* The schema is in Boyce-Codd Normal Form (BCNF). All attributes are atomic (1NF), there are no partial dependencies (2NF), there are no transitive dependencies between non-key attributes (3NF), and every determinant is a candidate key (BCNF).

---

# Section 16: Quick Revision Cheat Sheet

```
┌────────────────────────────────────────────────────────────────────────┐
│                        EVENTNEST AT A GLANCE                           │
├────────────────────────────────────────────────────────────────────────┤
│ • Student:         Aadi Charan (AU2024BCSE109)                         │
│ • Institution:     Alliance School of Advanced Computing               │
│ • Academic Year:   2026–2027                                           │
│ • Stack:           React 19 + Vite + Express + PostgreSQL 18 + CSS     │
│ • Port Allocation: Backend: 5000 | Frontend: 5173 | PostgreSQL: 5432   │
├────────────────────────────────────────────────────────────────────────┤
│ DATABASE SCHEMA SUMMARY                                                │
│ 1. students:       id (PK), name, email (UQ), student_id (UQ)          │
│ 2. events:         id (PK), title, description, date, time, venue,     │
│                    max_participants (CHECK > 0)                        │
│ 3. registrations:  id (PK), student_id (FK), event_id (FK),            │
│                    registered_at (DEFAULT NOW()),                      │
│                    UNIQUE(student_id, event_id)                        │
├────────────────────────────────────────────────────────────────────────┤
│ CORE REST ENDPOINTS                                                    │
│ • GET  /api                 -> Health check & API discovery            │
│ • GET  /api/events          -> List all events with dynamic capacity   │
│ • GET  /api/events/:id      -> Get single event details                │
│ • POST /api/events          -> Create new campus event (201 Created)   │
│ • GET  /api/registrations   -> List all registrations (joined view)    │
│ • POST /api/registrations   -> Register student for event              │
│                                (201 Success, 400 Full, 409 Duplicate)  │
├────────────────────────────────────────────────────────────────────────┤
│ KEY VALIDATION CODES                                                   │
│ • HTTP 200: Successful data fetch                                      │
│ • HTTP 201: Successfully created event or registration                 │
│ • HTTP 400: Missing input or event capacity full                       │
│ • HTTP 404: Event ID does not exist                                    │
│ • HTTP 409: Duplicate registration detected                            │
│ • HTTP 500: Internal server error (centralized catch-all)              │
└────────────────────────────────────────────────────────────────────────┘
```

---
*End of EventNest Complete Guide — Prepared for Alliance University Micro-Project Submissions.*
