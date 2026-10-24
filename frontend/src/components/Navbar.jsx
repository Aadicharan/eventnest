import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="brand-logo" id="nav-brand">
          <div className="brand-icon">E</div>
          <span>EventNest</span>
        </Link>

        <ul className="nav-links">
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              id="nav-link-home"
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/events" 
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              id="nav-link-events"
            >
              Events
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/registrations" 
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              id="nav-link-registrations"
            >
              Registrations
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/create-event" 
              className="btn nav-btn"
              id="nav-btn-create"
            >
              + Create Event
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
