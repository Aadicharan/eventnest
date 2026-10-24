import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRegistrations } from '../services/api';
import Alert from '../components/Alert';

export default function Registrations() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRegistrationsList = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRegistrations();
      setRegistrations(data);
    } catch (err) {
      console.error('Error fetching registrations:', err);
      setError(err.message || 'Failed to load registrations from the database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrationsList();
  }, []);

  const filtered = registrations.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      (r.student_name && r.student_name.toLowerCase().includes(q)) ||
      (r.student_id && r.student_id.toLowerCase().includes(q)) ||
      (r.student_email && r.student_email.toLowerCase().includes(q)) ||
      (r.event_title && r.event_title.toLowerCase().includes(q))
    );
  });

  return (
    <div className="container">
      <div className="section-header">
        <div>
          <h1 className="section-title">Event Registrations</h1>
          <p className="section-subtitle">
            Overview of all student event registrations stored in the PostgreSQL relational database.
          </p>
        </div>

        <Link to="/register" className="btn btn-primary" id="regs-register-btn">
          + New Registration
        </Link>
      </div>

      {/* Search Filter */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', gap: '1rem', maxWidth: '500px' }}>
        <input
          type="text"
          className="form-control"
          placeholder="Filter by student name, roll number, or event title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="registrations-search-input"
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
          <p style={{ color: 'var(--text-muted)' }}>Loading registration records from PostgreSQL...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="state-box">
          <h3>No registrations recorded yet</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            {searchQuery 
              ? 'No registrations match your search keyword.' 
              : 'Be the first student to register for a campus event!'}
          </p>
          <Link to="/register" className="btn btn-primary">
            Register for an Event
          </Link>
        </div>
      ) : (
        <div className="table-card" id="registrations-table-card">
          <div className="table-responsive">
            <table className="data-table" id="registrations-table">
              <thead>
                <tr>
                  <th>Reg ID</th>
                  <th>Student Name</th>
                  <th>Roll / Student ID</th>
                  <th>Student Email</th>
                  <th>Event Name</th>
                  <th>Event Date & Time</th>
                  <th>Venue</th>
                  <th>Registered At</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} id={`registration-row-${item.id}`}>
                    <td style={{ fontWeight: 700, color: 'var(--primary)' }}>#{item.id}</td>
                    <td style={{ fontWeight: 600 }}>{item.student_name}</td>
                    <td>
                      <span className="student-tag">{item.student_id}</span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{item.student_email}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                      <Link to={`/events/${item.event_id}`} style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                        {item.event_title}
                      </Link>
                    </td>
                    <td>
                      <div>{item.event_date}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.event_time}</div>
                    </td>
                    <td style={{ fontSize: '0.875rem' }}>{item.event_venue}</td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      {new Date(item.registered_at).toLocaleString([], {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
