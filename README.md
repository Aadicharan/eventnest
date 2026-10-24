# EVENTNEST – College Event Registration Platform

> **Student:** Aadi Charan (AU2024BCSE109)  
> **Institution:** Alliance School of Advanced Computing, Alliance University, Bengaluru  
> **Academic Year:** 2026–2027  
> **Micro-Project Submissions:** Back-End Web Development • Full Stack Web Development • Advanced Database Systems  

**Stack:** React 19 (Vite) • Node.js + Express • PostgreSQL 18 • node-postgres (`pg`) • Vanilla CSS

```
React (localhost:5173)  --HTTP/JSON-->  Express API (localhost:5000)  --pg.Pool-->  PostgreSQL (localhost:5432)
```

- **GitHub Repository:** https://github.com/Aadicharan/eventnest
- **Live Deployed Application:** Localhost Deployment (Demonstrated in local development environment on `http://localhost:5173` and `http://localhost:5000`)
- **Master Documentation:** [EventNest_Complete_Guide.md](./EventNest_Complete_Guide.md)
- **Academic Reports:**
  - [Backend_Report.pdf](./reports/Backend_Report.pdf) — Back-End Web Development
  - [FullStack_Report.pdf](./reports/FullStack_Report.pdf) — Full Stack Web Development
  - [ADBMS_Report.pdf](./reports/ADBMS_Report.pdf) — Advanced Database Systems

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Academic Subject Coverage](#2-academic-subject-coverage)
3. [Prerequisites](#3-prerequisites)
4. [Database Configuration & Setup](#4-database-configuration--setup)
5. [Quick Start (How to Run)](#5-quick-start-how-to-run)
6. [API Endpoints Summary](#6-api-endpoints-summary)
7. [Automated Testing & Verification](#7-automated-testing--verification)
8. [Folder Structure](#8-folder-structure)
9. [Screenshots & Visual Evidence](#9-screenshots--visual-evidence)
10. [Security & Credentials Note](#10-security--credentials-note)

---

## 1. Project Overview

College events like workshops, hackathons, and guest lectures are often organized across multiple departments. Managing registrations using paper lists or uncontrolled spreadsheets leads to overbooking, accidental duplicate submissions, and lack of real-time seat tracking.

**EventNest** is a three-tier web application built to solve these campus challenges:
- Students can browse upcoming campus events and see live remaining seat counts.
- Controlled forms with client-side validation validate input fields before submission.
- The Express REST backend enforces event capacity limits and business rules.
- PostgreSQL relational tables maintain entity integrity, referential cascade actions, and duplicate-prevention constraints.

---

## 2. Academic Subject Coverage

| Subject | Core Concepts Implemented in EventNest | Location |
|---|---|---|
| **Back-End Web Development** | Express server lifecycle, RESTful routing, layered controllers, parameter validation, centralized error handling, connection pooling, SQL injection prevention | `backend/` |
| **Full Stack Web Development** | React 19 SPA, Vite proxy, React Router DOM, React Hook Form validation, custom CSS design system, centralized API service layer (`api.js`) | `frontend/` |
| **Advanced Database Systems** | PostgreSQL relational modeling, primary/foreign keys (`ON DELETE CASCADE`), composite unique constraint, domain check (`CHECK > 0`), normalization (1NF–BCNF), dynamic SQL aggregation | `database/` |

---

## 3. Prerequisites

- **Node.js 20+ LTS** (Recommended: v22 or v24/v25) — https://nodejs.org
- **PostgreSQL 16+** (Recommended: PostgreSQL 18) — https://www.postgresql.org/download/
- **(Optional) Postman** for API testing — https://www.postman.com/downloads/

---

## 4. Database Configuration & Setup

1. Open PowerShell and start the PostgreSQL service (if not already running):
   ```powershell
   Start-Process "C:\Program Files\PostgreSQL\18\bin\postgres.exe" -ArgumentList '-D "C:\Program Files\PostgreSQL\18\data"'
   ```

2. Create the database `eventnest_db` and execute the schema and seed scripts:
   ```powershell
   # Create database
   & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -c "CREATE DATABASE eventnest_db;"

   # Apply schema (tables, constraints, indexes)
   & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d eventnest_db -f "database\schema.sql"

   # Insert seed data (sample students, events, registrations)
   & "C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres -d eventnest_db -f "database\seed.sql"
   ```

---

## 5. Quick Start (How to Run)

### Terminal 1: Backend Server (Port 5000)
```powershell
cd backend

# Copy .env.example to .env (edit if your PostgreSQL password is not postgres)
Copy-Item .env.example .env

# Install backend dependencies (if running for the first time)
npm install

# Start the server
npm start
```
*The terminal will confirm:*
```
Connected to PostgreSQL database at localhost:5432
Database: eventnest_db
EventNest backend server running on http://localhost:5000
```

### Terminal 2: Frontend Client (Port 5173)
```powershell
cd frontend

# Install frontend dependencies (if running for the first time)
npm install

# Start the Vite development server
npm run dev
```

Open **`http://localhost:5173`** in your browser.

---

## 6. API Endpoints Summary

All requests communicate via JSON. Base URL: `http://localhost:5000/api`.

| Method | Endpoint | Expected Status | Purpose |
|---|---|---|---|
| `GET` | `/api` | `200 OK` | Health check & available endpoints directory |
| `GET` | `/api/events` | `200 OK` | List events with calculated seat metrics |
| `GET` | `/api/events/:id` | `200 OK` / `404` | Get single event details by ID |
| `POST` | `/api/events` | `201 Created` / `400` | Create a new campus event |
| `GET` | `/api/registrations` | `200 OK` | List all registrations (joined view) |
| `POST` | `/api/registrations` | `201` / `400` / `409` | Register student for event |

Import `postman/EventNest_API.postman_collection.json` into Postman to test all endpoints with pre-configured request payloads.

---

## 7. Automated Testing & Verification

EventNest includes an automated academic test suite that tests all 9 academic criteria:

```powershell
# Run from the project root directory:
node test_suite.js
```

### Verified Test Output
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
[PASS] POST /api/registrations registered student Tanvi Shinde with status 201.

--- Test 6: Duplicate Registration ---
[PASS] Duplicate registration rejected with HTTP 409: "Student is already registered for this event."

--- Test 7: Full Event Handling ---
[PASS] Full event registration rejected with HTTP 400: "Event is full."

--- Test 8: REST API Response & Status Codes ---
[PASS] Status codes verified: 404 for missing resource, 200 for registrations list.

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

## 8. Folder Structure

```
Event nest/
├── database/                     # PostgreSQL schema and seed data
│   ├── schema.sql
│   └── seed.sql
├── backend/                      # Express REST API
│   ├── app.js
│   ├── server.js
│   ├── test_api.js
│   ├── db/index.js               # PostgreSQL connection pool
│   ├── routes/                   # eventsRoutes.js, registrationsRoutes.js
│   └── controllers/              # eventsController.js, registrationsController.js
├── frontend/                     # React 19 SPA (Vite)
│   ├── index.html
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── services/api.js       # Centralized API service
│       ├── components/           # Navbar.jsx, EventCard.jsx, Alert.jsx
│       └── pages/                # Home, Events, EventDetails, CreateEvent, Register, Registrations
├── postman/                      # Postman collection v2.1.0
├── screenshots/                  # 11 genuine screenshots of the running application
├── reports/                      # 3 official subject micro-project reports
│   ├── Backend_Report.pdf
│   ├── FullStack_Report.pdf
│   └── ADBMS_Report.pdf
├── EventNest_Complete_Guide.md   # Comprehensive student handbook & viva guide
├── test_suite.js                 # Automated academic test runner
└── README.md                     # Root documentation
```

---

## 9. Screenshots & Visual Evidence

All screenshots in the `screenshots/` directory are captured from live local browser runs:
- `output_1_home_dashboard.png`: Home dashboard with hero banner and stats.
- `output_2_events_catalog.png`: Events catalog showing available and full badges.
- `output_3_event_details.png`: Single event details page with registration CTA.
- `output_4_create_event_form.png`: Event publishing form with input fields.
- `output_5_registration_page.png`: Student registration form.
- `output_6_registration_validation.png`: Client-side validation errors on empty submission.
- `output_7_duplicate_registration_alert.png`: HTTP 409 Conflict rejection on duplicate registration.
- `output_8_full_event_alert.png`: HTTP 400 rejection on full capacity event.
- `output_9_successful_registration.png`: HTTP 201 Created confirmation summary card.
- `output_10_registrations_table.png`: Joined 3-table registrations roster.
- `output_11_api_health_endpoint.png`: JSON response from root API health check.

---

## 10. Security & Credentials Note

**Never commit `backend/.env` to Git.**  
The local `.env` contains your personal PostgreSQL password. Only `.env.example` with placeholder values is tracked in version control. All submission deliverables exclude sensitive environment files.
