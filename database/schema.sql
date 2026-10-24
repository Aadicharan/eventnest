-- ==========================================================
-- EVENTNEST: College Event Registration Platform
-- Database Schema (PostgreSQL)
-- Micro Project: Relational Data Model & ER Relationships
-- ==========================================================

-- Drop tables if they already exist (in reverse order of foreign key dependencies)
DROP TABLE IF EXISTS registrations CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS students CASCADE;

-- 1. STUDENTS Table
-- Represents college students registering for events
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    student_id VARCHAR(50) NOT NULL UNIQUE
);

-- 2. EVENTS Table
-- Represents college events organized on campus
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    time VARCHAR(50) NOT NULL,
    venue VARCHAR(150) NOT NULL,
    max_participants INT NOT NULL CHECK (max_participants > 0)
);

-- 3. REGISTRATIONS Table (Bridge / Associative Entity)
-- Establishes 1:M from Students to Registrations and 1:M from Events to Registrations
CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    -- Unique constraint preventing duplicate registration for the same event
    CONSTRAINT unique_student_event UNIQUE (student_id, event_id)
);

-- Indexes for performance on foreign keys
CREATE INDEX idx_registrations_student_id ON registrations(student_id);
CREATE INDEX idx_registrations_event_id ON registrations(event_id);
