import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEventById } from '../services/api';
import Alert from '../components/Alert';

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        setError(null);
        const data = await getEventById(id);
        setEvent(data);
      } catch (err) {
        console.error('Error fetching event details:', err);
        setError(err.message || 'Failed to load event details.');
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="container">
        <div className="state-box">
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-muted)' }}>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="container" style={{ maxWidth: '640px' }}>
        <Alert type="danger" message={error || 'Event could not be found.'} />
        <Link to="/events" className="btn btn-outline">
          &larr; Back to Events
        </Link>
      </div>
    );
  }

  const isFull = event.is_full || event.available_seats <= 0;
  const fillPercentage = Math.min(
    100,
    Math.round(((event.registered_count || 0) / event.max_participants) * 100)
  );

  return (
    <div className="container">
      <div style={{ marginBottom: '1.5rem' }}>
        <Link to="/events" className="btn btn-outline" id="back-to-events-btn">
          &larr; Back to All Events
        </Link>
      </div>

      <div className="details-container">
        <div className="details-hero">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span className="concept-tag tag-backend" style={{ background: 'rgba(255,255,255,0.2)', color: 'white' }}>
              Campus Activity
            </span>
            <span className={`seat-badge ${isFull ? 'badge-full' : 'badge-available'}`} id="details-seat-badge">
              {isFull ? '● Event is Full' : `● ${event.available_seats} Seats Remaining`}
            </span>
          </div>

          <h1 style={{ fontSize: '2.2rem', color: 'white', marginBottom: '0.75rem' }} id="details-title">
            {event.title}
          </h1>
          <p style={{ color: '#c7d2fe', fontSize: '1.05rem' }}>
            College ID: #{event.id} &bull; Hosted at {event.venue}
          </p>
        </div>

        {/* Structured Meta Grid */}
        <div className="details-meta-grid">
          <div className="meta-box">
            <div className="meta-box-label">Date</div>
            <div className="meta-box-val" id="details-date">{event.date}</div>
          </div>
          <div className="meta-box">
            <div className="meta-box-label">Time</div>
            <div className="meta-box-val" id="details-time">{event.time}</div>
          </div>
          <div className="meta-box">
            <div className="meta-box-label">Venue Location</div>
            <div className="meta-box-val" id="details-venue">{event.venue}</div>
          </div>
          <div className="meta-box">
            <div className="meta-box-label">Max Seating Capacity</div>
            <div className="meta-box-val" id="details-max-seats">{event.max_participants} Students</div>
          </div>
        </div>

        <div className="details-content">
          <h3 style={{ marginBottom: '0.75rem' }}>About This Event</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', whiteSpace: 'pre-line', lineHeight: '1.7' }} id="details-description">
            {event.description}
          </p>

          {/* Seating Capacity Meter */}
          <div className="capacity-meter">
            <div className="meter-header">
              <span>Seating Occupancy</span>
              <span>
                {event.registered_count} / {event.max_participants} registered ({fillPercentage}%)
              </span>
            </div>
            <div className="progress-bar-bg">
              <div 
                className={`progress-bar-fill ${isFull ? 'full' : ''}`}
                style={{ width: `${fillPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
            {isFull ? (
              <button 
                type="button" 
                className="btn btn-secondary btn-full"
                disabled
                id="details-register-btn-disabled"
              >
                Event Full – Registration Closed
              </button>
            ) : (
              <Link 
                to={`/register?eventId=${event.id}`} 
                className="btn btn-primary btn-full"
                id="details-register-btn"
              >
                Register for this Event &rarr;
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
