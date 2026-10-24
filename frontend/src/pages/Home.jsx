import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, getRegistrations } from '../services/api';

export default function Home() {
  const [stats, setStats] = useState({ eventsCount: 0, regCount: 0, availableSeats: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [events, regs] = await Promise.all([getEvents(), getRegistrations()]);
        const totalAvailable = events.reduce((acc, curr) => acc + (curr.available_seats || 0), 0);
        setStats({
          eventsCount: events.length,
          regCount: regs.length,
          availableSeats: totalAvailable,
        });
      } catch (err) {
        console.error('Error loading home statistics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Banner */}
      <section className="hero">
        <h1 className="hero-title">
          <span>EventNest</span>
        </h1>
        <p className="hero-subtitle">
          College Event Registration Platform. Explore upcoming campus events, technical workshops, seminars, and secure your spot with instant registration.
        </p>
        <div className="hero-actions">
          <Link to="/events" className="btn btn-primary" id="hero-view-events-btn">
            View College Events
          </Link>
          <Link to="/create-event" className="btn btn-secondary" id="hero-create-event-btn">
            + Host New Event
          </Link>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="container">
        <div className="section-header" style={{ justifyContent: 'center', textAlign: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h2 className="section-title">Campus Event Management</h2>
            <p className="section-subtitle">
              A streamlined platform for students, clubs, and college event organizers
            </p>
          </div>
        </div>

        <div className="concept-grid">
          {/* Feature 1 */}
          <div className="concept-card">
            <h3>Explore Campus Events</h3>
            <p>
              Browse upcoming college hackathons, technical workshops, and seminars with live seat availability.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="concept-card">
            <h3>Instant Seat Registration</h3>
            <p>
              Fast and hassle-free registration with real-time capacity tracking to secure your confirmed spot.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="concept-card">
            <h3>Publish & Manage Events</h3>
            <p>
              Organize department and club events easily with structured venue, schedule, and seating capacity details.
            </p>
          </div>
        </div>

        {/* Live Metrics Summary */}
        <div className="details-meta-grid" style={{ borderRadius: '16px', marginBottom: '2.5rem' }}>
          <div className="meta-box">
            <div className="meta-box-label">Active Campus Events</div>
            <div className="meta-box-val" id="stat-events-count">
              {loading ? '...' : stats.eventsCount}
            </div>
          </div>
          <div className="meta-box">
            <div className="meta-box-label">Total Student Bookings</div>
            <div className="meta-box-val" id="stat-reg-count">
              {loading ? '...' : stats.regCount}
            </div>
          </div>
          <div className="meta-box">
            <div className="meta-box-label">Open Available Seats</div>
            <div className="meta-box-val" id="stat-seats-count" style={{ color: 'var(--success)' }}>
              {loading ? '...' : stats.availableSeats}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
