-- ==========================================================
-- EVENTNEST: College Event Registration Platform
-- Sample Seed Data (PostgreSQL)
-- ==========================================================

-- Clear existing data
TRUNCATE registrations, events, students RESTART IDENTITY CASCADE;

-- Insert Sample Students
INSERT INTO students (name, email, student_id) VALUES
('Rahul Sharma', 'rahul.sharma@college.edu', 'CS2023001'),
('Priya Patel', 'priya.patel@college.edu', 'EC2023045'),
('Amit Verma', 'amit.verma@college.edu', 'ME2023012'),
('Sneha Rao', 'sneha.rao@college.edu', 'IT2023089'),
('Vikram Singh', 'vikram.singh@college.edu', 'EE2023034');

-- Insert Sample Events
-- Note: "Workshop on Git & Open Source" has max_participants = 2 to easily demonstrate the "Event is Full" scenario
INSERT INTO events (title, description, date, time, venue, max_participants) VALUES
(
    'HackNest 2026: Annual College Hackathon',
    'A 24-hour coding marathon where students collaborate in teams to build innovative web and mobile solutions for real-world campus problems.',
    '2026-10-15',
    '09:00 AM',
    'Main Auditorium & Tech Lab 1',
    50
),
(
    'AI & Cloud Computing Symposium',
    'An interactive seminar and panel discussion with industry tech leads covering modern Generative AI, distributed cloud architectures, and career paths.',
    '2026-10-22',
    '02:00 PM',
    'Seminar Hall B',
    30
),
(
    'RoboWars: College Robotics Arena',
    'High-octane robot combat competition featuring autonomous obstacle navigation and line-follower challenges designed by student engineering clubs.',
    '2026-11-05',
    '10:30 AM',
    'College Sports Complex',
    25
),
(
    'Workshop on Git & Open Source',
    'Intensive hands-on masterclass on Git version control, GitHub workflows, and contributing to open source projects. Limited capacity for focused mentoring.',
    '2026-10-10',
    '11:00 AM',
    'Computer Lab 3',
    2
);

-- Insert Sample Registrations
-- Event 1 (HackNest 2026): Rahul and Priya registered
INSERT INTO registrations (student_id, event_id, registered_at) VALUES
(1, 1, '2026-09-28 10:15:00'),
(2, 1, '2026-09-28 11:30:00');

-- Event 2 (AI Symposium): Amit and Sneha registered
INSERT INTO registrations (student_id, event_id, registered_at) VALUES
(3, 2, '2026-09-29 09:45:00'),
(4, 2, '2026-09-29 14:20:00');

-- Event 4 (Workshop on Git & Open Source):
-- Registered 2 participants (Rahul & Vikram) -> Capacity is 2, so this event is initially FULL for testing!
INSERT INTO registrations (student_id, event_id, registered_at) VALUES
(1, 4, '2026-09-29 16:00:00'),
(5, 4, '2026-09-30 08:30:00');
