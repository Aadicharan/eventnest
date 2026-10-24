import React from 'react';
import { Link } from 'react-router-dom';

export default function EventCard({ event }) {
  const isFull = event.is_full || event.available_seats <= 0;

  return (
    <div className="event-card" id={`event-card-${event.id}`}>
      <div className="card-top">
        <div className="card-status-bar">
          <span className="concept-tag tag-backend">Campus Event</span>
          <span 
            className={`seat-badge ${isFull ? 'badge-full' : 'badge-available'}`}
            id={`seat-badge-${event.id}`}
          >
            {isFull ? '● Event Full' : `● ${event.available_seats} Seats Available`}
          </span>
        </div>
        <h3 className="event-title">{event.title}</h3>
        <p className="event-desc-snippet">{event.description}</p>
      </div>

      <div className="card-body">
        <div className="meta-item">
          <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span><strong>Date:</strong> {event.date}</span>
        </div>

        <div className="meta-item">
          <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span><strong>Time:</strong> {event.time}</span>
        </div>

        <div className="meta-item">
          <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span><strong>Venue:</strong> {event.venue}</span>
        </div>
      </div>

      <div className="card-footer">
        <Link 
          to={`/events/${event.id}`} 
          className="btn btn-outline"
          style={{ flex: 1 }}
          id={`view-details-btn-${event.id}`}
        >
          View Details
        </Link>
        <Link 
          to={isFull ? '#' : `/register?eventId=${event.id}`} 
          className={`btn ${isFull ? 'btn-secondary' : 'btn-primary'}`}
          style={{ 
            flex: 1, 
            pointerEvents: isFull ? 'none' : 'auto', 
            opacity: isFull ? 0.6 : 1,
            backgroundColor: isFull ? '#94a3b8' : undefined
          }}
          id={`register-btn-${event.id}`}
        >
          {isFull ? 'Full' : 'Register'}
        </Link>
      </div>
    </div>
  );
}
