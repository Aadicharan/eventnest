/**
 * EventNest API Service
 * Centralized service layer connecting React frontend to Express REST backend
 */

// Use relative path for Vite dev server proxying, or fallback to absolute URL
const API_BASE_URL = import.meta.env?.VITE_API_URL || '/api';

/**
 * Helper to handle fetch responses and standardize errors
 */
async function handleResponse(response) {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const error = (data && data.message) || `HTTP error! Status: ${response.status}`;
    const errObj = new Error(error);
    errObj.status = response.status;
    errObj.data = data;
    throw errObj;
  }

  return data;
}

/**
 * Fetch all college events with seat counts
 */
export async function getEvents() {
  const response = await fetch(`${API_BASE_URL}/events`);
  return handleResponse(response);
}

/**
 * Fetch single event details by ID
 */
export async function getEventById(id) {
  const response = await fetch(`${API_BASE_URL}/events/${id}`);
  return handleResponse(response);
}

/**
 * Create a new event
 * @param {Object} eventData { title, description, date, time, venue, max_participants }
 */
export async function createEvent(eventData) {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(eventData),
  });
  return handleResponse(response);
}

/**
 * Register a student for an event
 * @param {Object} regData { student_name, student_email, student_id, event_id }
 */
export async function registerStudent(regData) {
  const response = await fetch(`${API_BASE_URL}/registrations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(regData),
  });
  return handleResponse(response);
}

/**
 * Fetch all registrations with joined student and event details
 */
export async function getRegistrations() {
  const response = await fetch(`${API_BASE_URL}/registrations`);
  return handleResponse(response);
}
