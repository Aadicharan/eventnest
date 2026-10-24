import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../services/api';
import EventCard from '../components/EventCard';
import Alert from '../components/Alert';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEventsList = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getEvents();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError(err.message || 'Failed to connect to the backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventsList();
  }, []);

  const filteredEvents = events.filter((e) => {
    const q = searchQuery.toLowerCase();
    return (
      e.title.toLowerCase().includes(q) ||
      e.venue.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container">
      <div className="section-header">
        <div>
          <h1 className="section-title">College Events</h1>
          <p className="section-subtitle">
            Browse upcoming campus events, view seating availability, and secure your spot.
          </p>
        </div>

        <Link to="/create-event" className="btn btn-primary" id="events-create-btn">
          + Create New Event
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', maxWidth: '500px' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Search by event title, venue, or keyword..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="events-search-input"
        />
        {searchQuery && (
          <button 
            type="button" 
            className="btn btn-outline" 
            onClick={() => setSearchQuery('')}
            style={{ flexShrink: 0 }}
          >
            Clear
          </button>
        )}
      </div>

      {error && <Alert type="danger" message={error} />}

      {loading ? (
        <div className="state-box">
          <div className="spinner"></div>
          <p style={{ color: 'var(--text-muted)' }}>Loading college events from PostgreSQL...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="state-box">
          <h3>No events found</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            {searchQuery 
              ? 'No events match your search criteria.' 
              : 'There are no college events scheduled yet.'}
          </p>
          <Link to="/create-event" className="btn btn-primary">
            Create First Event
          </Link>
        </div>
      ) : (
        <div className="event-grid" id="events-grid">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
