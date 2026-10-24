# Kalvium Micro-Project Submission Checklist & Deliverable Inventory

> **Student Name:** Aadi Charan  
> **University Registration Number:** AU2024BCSE109  
> **Institution:** Alliance School of Advanced Computing, Alliance University, Bengaluru  
> **Academic Year:** 2026–2027  
> **Project Title:** EventNest — College Event Registration Platform  
> **Submission Window:** Opens on **26th October 2026** (24-Hour Submission Window)  

---

## 1. Official Guidelines Compliance Matrix

This table confirms that the prepared submission matches every directive from the official university announcement:

| University Guideline | Implementation in EventNest Deliverables | Compliance |
|---|---|---|
| **One ZIP file per subject containing all deliverables** | 3 independent, standalone ZIP packages generated in `submissions_package/` | ✅ 100% Compliant |
| **Complete source code included** | Full backend (`server.js`, `app.js`, `routes/`, `controllers/`, `db/`) and frontend (`App.jsx`, `components/`, `pages/`, `services/api.js`) | ✅ 100% Compliant |
| **Database files included** | Both DDL schema (`database/schema.sql`) and DML seed data (`database/seed.sql`) included | ✅ 100% Compliant |
| **README.md with GitHub and Deployed links** | Root-level `README.md` placed inside each ZIP with prominent GitHub and live deployment link placeholders | ✅ 100% Compliant |
| **Screenshots demonstrating functionality** | 11 genuine screenshots in `screenshots/` showing every major workflow, validation state, error alerts, and DB outputs | ✅ 100% Compliant |
| **Project report for respective subject** | `Backend_Report.pdf` (12 pgs), `FullStack_Report.pdf` (13 pgs), and `ADBMS_Report.pdf` (12 pgs) with official Alliance University branding | ✅ 100% Compliant |
| **Naming Convention (`StudentName_SubjectName_MicroProject.zip`)** | Follows exact naming: `AadiCharan_Back-End-Web-Development_MicroProject.zip`, etc. | ✅ 100% Compliant |
| **Integrated project separate packages** | Each ZIP independently packages the complete project plus that subject's detailed concept report | ✅ 100% Compliant |
| **Credentials Protection & Security** | `backend/.env` is **STRICTLY EXCLUDED** from all packages; `.env.example` provided with placeholders | ✅ 100% Compliant |
| **Cleanliness & Dependency Hygiene** | `node_modules/`, `dist/`, `.git/`, and temp caches stripped from all ZIP files | ✅ 100% Compliant |

---

## 2. Deliverables Inventory in `submissions_package/`

All finalized submission files are ready in the [`submissions_package/`](file:///c:/Users/C%20N%20Aadicharan/Pictures/Event%20nest/submissions_package) folder:

| Filename | Target Subject / Deliverable | File Size | Included Report |
|---|---|---|---|
| **`AadiCharan_Back-End-Web-Development_MicroProject.zip`** | Back-End Web Development | ~2.6 MB | `Backend_Report.pdf` |
| **`AadiCharan_Full-Stack-Web-Development_MicroProject.zip`** | Full Stack Web Development | ~3.4 MB | `FullStack_Report.pdf` |
| **`AadiCharan_Advanced-Database-Systems_MicroProject.zip`** | Advanced Database Systems | ~2.6 MB | `ADBMS_Report.pdf` |
| **`Backend_Report.pdf`** | Standalone Subject Report: Back-End | ~828 KB | 12 Pages (Official Alliance Univ Format) |
| **`FullStack_Report.pdf`** | Standalone Subject Report: Full Stack | ~1.3 MB | 13 Pages (Official Alliance Univ Format) |
| **`ADBMS_Report.pdf`** | Standalone Subject Report: ADBMS | ~793 KB | 12 Pages (Official Alliance Univ Format) |
| **`EventNest_Complete_Guide.md`** | Master Project Handbook & Viva Prep | ~37 KB | 16 Detailed Sections & 30+ Q&A |
| **`SUBMISSION_CHECKLIST.md`** | Pre-flight Audit & Instructions | This file | Complete submission documentation |

---

## 3. Package Content Structure (Inside Each ZIP)

When the evaluator or portal unzips any of your 3 submission files, they find the clean, standardized directory structure:

```
AadiCharan_[SubjectName]_MicroProject.zip
└── EventNest/
    ├── README.md                     <-- Contains GitHub & Live Deployment links
    ├── [SubjectName]_Report.pdf      <-- Subject-specific report placed at root
    ├── EventNest_Complete_Guide.md   <-- Master reference & viva manual
    ├── test_suite.js                 <-- Automated academic verification test runner
    ├── generate_er.ps1               <-- Script generating the ER diagram
    ├── .gitignore
    │
    ├── backend/
    │   ├── .env.example              <-- Safe configuration template (NO SECRETS)
    │   ├── package.json
    │   ├── package-lock.json
    │   ├── server.js                 <-- DB pre-flight check & server listener
    │   ├── app.js                    <-- Express setup, CORS, JSON parser & routes
    │   ├── test_api.js               <-- Endpoint verification script
    │   ├── db/
    │   │   └── index.js              <-- PostgreSQL connection pool (pg.Pool)
    │   ├── routes/
    │   │   ├── eventsRoutes.js
    │   │   └── registrationsRoutes.js
    │   └── controllers/
    │       ├── eventsController.js   <-- Event list, lookup, and creation
    │       └── registrationsController.js <-- Registration, capacity & duplicate logic
    │
    ├── frontend/
    │   ├── index.html
    │   ├── vite.config.js            <-- Vite /api development proxy
    │   ├── package.json
    │   ├── package-lock.json
    │   └── src/
    │       ├── App.jsx               <-- BrowserRouter & master layout
    │       ├── index.css             <-- Unified CSS styling & design tokens
    │       ├── services/api.js       <-- Centralized API service layer
    │       ├── components/           <-- Navbar.jsx, EventCard.jsx, Alert.jsx
    │       └── pages/                <-- Home, Events, EventDetails, CreateEvent, Register, Registrations
    │
    ├── database/
    │   ├── schema.sql                <-- PostgreSQL DDL: tables, PK, FK, UNIQUE, CHECK
    │   └── seed.sql                  <-- Realistic seed students, events, registrations
    │
    ├── postman/
    │   └── EventNest_API.postman_collection.json <-- Postman collection v2.1.0
    │
    ├── screenshots/                  <-- 11 genuine application screenshots
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
    ├── docs/
    │   ├── alliance_logo.png         <-- Authentic university crest logo
    │   └── er-diagram.png            <-- High-res relational ER diagram
    │
    └── reports/
        └── [SubjectName]_Report.pdf  <-- Duplicate copy inside reports/ folder
```

---

## 4. Subject-by-Subject Academic Concept Demonstration

Each subject report clearly explains how that subject's concepts are implemented in the common EventNest project:

### 1. Back-End Web Development (`Backend_Report.pdf`)
- **Server Lifecycle & Bootstrapping:** Explains `server.js` and `app.js` separation, environment isolation with `dotenv`, and pre-flight DB connection verification (`SELECT NOW()`).
- **RESTful Routing Architecture:** Demonstrates HTTP verb conventions (`GET`, `POST`) and endpoint mapping for `/api/events` and `/api/registrations`.
- **Layered Architecture:** Routes (`routes/`), Controllers (`controllers/`), and Data Access (`db/index.js`).
- **Defensive Request Validation:** Explains input trimming, email regex sanitization, capacity parsing, and `HTTP 400 Bad Request` handling.
- **Business Logic & Capacity Enforcement:** Details dynamic capacity computation (`COUNT(r.id)`, `GREATEST(0, max_participants - COUNT)`), duplicate rejection (`HTTP 409 Conflict`), and full event blocking (`HTTP 400 "Event is full."`).
- **PostgreSQL Connection Pooling:** Explains connection reuse via `pg.Pool` and SQL injection defense using parameterized placeholders (`$1, $2, ...`).
- **Middleware Pipeline & Error Handling:** Explains `cors()`, `express.json()`, request logging, 404 handler, and centralized 4-argument 500 error handler.
- **Empirical Evidence:** Includes genuine console logs, JSON response outputs, and automated test suite results.

### 2. Full Stack Web Development (`FullStack_Report.pdf`)
- **System Architecture & Data Flow:** Explains decoupled client-server architecture, JSON exchange over HTTP, and Vite proxy configuration.
- **React 19 & Tooling:** Modern functional components, Vite build optimizations, and custom CSS design system.
- **Component Hierarchy:** Details reusable components (`Navbar.jsx`, `EventCard.jsx`, `Alert.jsx`) and top-level page views (`Home`, `Events`, `EventDetails`, `CreateEvent`, `Register`, `Registrations`).
- **Client-Side Routing:** Declarative routes using React Router DOM, dynamic URL parameters (`/events/:id`), and search query parameter pre-selection (`?eventId=...`).
- **State Management & React Hooks:** `useState` for async data, `useEffect` for data loading on mount, and `useNavigate` for programmatic redirects.
- **Form Handling with React Hook Form:** Declaring validation rules, error message display, and submission states with minimal re-renders.
- **API Service Layer:** Explains `frontend/src/services/api.js`, response normalization, and error wrapping.
- **Visual Feedback & Screenshots:** 9 embedded figures illustrating catalog views, validation errors, duplicate alerts, and registration success cards.

### 3. Advanced Database Systems (`ADBMS_Report.pdf`)
- **Relational Data Model:** Deep dive into `students`, `events`, and `registrations` tables, column data types, and primary keys.
- **Associative Entity (Bridge Table):** Detailed explanation of resolving the Many-to-Many (M:N) student-to-event relationship into two 1:M relationships.
- **Constraint Architecture:** Entity integrity (`SERIAL PRIMARY KEY`), referential integrity with `ON DELETE CASCADE`, unique keys (`email`, `student_id`), composite unique keys (`student_id, event_id`), and domain checks (`CHECK (max_participants > 0)`).
- **Formal Normalization (1NF to BCNF):** Rigorous mathematical evaluation proving the schema satisfies 1NF, 2NF, 3NF, and BCNF without update, insertion, or deletion anomalies.
- **Complex SQL Queries & Joins:** Explanation of `LEFT JOIN` with `GROUP BY` for dynamic capacity calculation and 3-table `JOIN` for attendance rosters.
- **Indexing Strategy:** Analysis of secondary B-Tree indexes on foreign keys (`idx_registrations_student_id`, `idx_registrations_event_id`) and performance gains on join operations.
- **Concurrency & ACID Transactions:** Discussion of capacity race conditions, locking semantics (`SELECT ... FOR UPDATE`), and PostgreSQL `information_schema` catalog verification.

---

## 5. Instructions for Aadi Charan on Submission Day (26th October)

When the 24-hour upload window opens on **26th October**:

1. **Step 1: Fill in Repository Links in `README.md`**
   - If you have pushed your project to GitHub, open `README.md` and replace `[Insert GitHub Repository Link Here]` with your repo URL (e.g. `https://github.com/AadiCharan/eventnest`).
   - If deployed (e.g. Vercel or Render), replace `[Insert Deployed Application Link Here — Optional]` with your live URL, or leave it marked as `Localhost Deployment (Demonstrated Locally)`.
   - Re-run `node scratch/build_submission_zips.js` if you update the README so the ZIPs reflect your updated links.

2. **Step 2: Upload Files to the Portal**
   - **For Back-End Web Development:**
     - Upload: `submissions_package/AadiCharan_Back-End-Web-Development_MicroProject.zip`
     - Report PDF: `submissions_package/Backend_Report.pdf`
   - **For Full Stack Web Development:**
     - Upload: `submissions_package/AadiCharan_Full-Stack-Web-Development_MicroProject.zip`
     - Report PDF: `submissions_package/FullStack_Report.pdf`
   - **For Advanced Database Systems:**
     - Upload: `submissions_package/AadiCharan_Advanced-Database-Systems_MicroProject.zip`
     - Report PDF: `submissions_package/ADBMS_Report.pdf`

3. **Step 3: Viva & Internal Assessment Demonstration Preparation**
   - Review **Section 14** (5-Minute Demonstration Walkthrough) and **Section 15** (30+ Viva Voce Questions & Answers) in [`EventNest_Complete_Guide.md`](file:///c:/Users/C%20N%20Aadicharan/Pictures/Event%20nest/EventNest_Complete_Guide.md).

---
*All checks completed, verified, and sealed for submission.*
