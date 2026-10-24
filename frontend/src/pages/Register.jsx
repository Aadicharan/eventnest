import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { getEvents, registerStudent } from '../services/api';
import Alert from '../components/Alert';

export default function Register() {
  const [searchParams] = useSearchParams();
  const preselectedEventId = searchParams.get('eventId');

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [submitError, setSubmitError] = useState(null);
  const [confirmedRegistration, setConfirmedRegistration] = useState(null);

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onTouched',
    defaultValues: {
      student_name: '',
      student_email: '',
      student_id: '',
      event_id: preselectedEventId ? String(preselectedEventId) : '',
    },
  });

  // Load events list for the dropdown
  useEffect(() => {
    async function loadEvents() {
      try {
        setLoadingEvents(true);
        const data = await getEvents();
        setEvents(data);

        // Pre-select event if eventId query param was supplied
        if (preselectedEventId) {
          setValue('event_id', String(preselectedEventId), {
            shouldValidate: true,
            shouldDirty: true,
          });
        }
      } catch (err) {
        console.error('Failed to load events for registration:', err);
        setSubmitError('Failed to load events from the server.');
      } finally {
        setLoadingEvents(false);
      }
    }
    loadEvents();
  }, [preselectedEventId, setValue]);

  // Successful submission handler
  const onSubmit = async (formData) => {
    setSubmitError(null);

    try {
      const response = await registerStudent({
        student_name: formData.student_name.trim(),
        student_email: formData.student_email.trim(),
        student_id: formData.student_id.trim(),
        event_id: formData.event_id,
      });

      // Set confirmed registration data to display success view
      setConfirmedRegistration({
        message: response.message || 'Registration confirmed!',
        details: response.registration,
        eventTitle: events.find((e) => String(e.id) === String(formData.event_id))?.title || 'Selected Event',
      });

      // Clear form inputs
      reset({
        student_name: '',
        student_email: '',
        student_id: '',
        event_id: '',
      });
    } catch (err) {
      console.error('Registration failed:', err);
      // Handles 409 (already registered), 400 (event is full / validation), etc.
      setSubmitError(err.message || 'An error occurred during registration.');
    }
  };

  // Validation failure handler (triggers when user presses submit but inputs are invalid)
  const onError = (formErrors) => {
    console.warn('Form validation errors:', formErrors);
    const firstKey = Object.keys(formErrors)[0];
    if (firstKey && formErrors[firstKey]?.message) {
      setSubmitError(`Please fix the form: ${formErrors[firstKey].message}`);
    } else {
      setSubmitError('Please complete all required fields marked with an asterisk (*).');
    }
  };

  // Helper to allow registering another student
  const handleRegisterAnother = () => {
    setConfirmedRegistration(null);
    setSubmitError(null);
    reset({
      student_name: '',
      student_email: '',
      student_id: '',
      event_id: '',
    });
  };

  return (
    <div className="container">
      <div className="form-card">
        <div className="form-header">
          <h2>Register for an Event</h2>
          <p>Provide your student details to reserve a confirmed seat at the event.</p>
        </div>

        {/* Global Error Alert */}
        {submitError && (
          <Alert 
            type="danger" 
            message={submitError} 
            onClose={() => setSubmitError(null)} 
          />
        )}

        {/* Success Confirmation Card */}
        {confirmedRegistration ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div 
              style={{
                width: '64px',
                height: '64px',
                background: 'var(--success-light)',
                border: '2px solid var(--success-border)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                color: 'var(--success)',
              }}
            >
              <svg width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--success-text)' }}>
              Registration Confirmed!
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.75rem', fontSize: '1rem' }}>
              {confirmedRegistration.message}
            </p>

            {confirmedRegistration.details && (
              <div 
                style={{
                  background: 'var(--bg-subtle)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  textAlign: 'left',
                  marginBottom: '2rem',
                }}
              >
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>EVENT:</strong>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--primary)' }}>
                    {confirmedRegistration.details.event_title || confirmedRegistration.eventTitle}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.75rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Student Name:</span>
                    <div style={{ fontWeight: 600 }}>{confirmedRegistration.details.student_name}</div>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Student / Roll ID:</span>
                    <div style={{ fontWeight: 600 }}>{confirmedRegistration.details.student_id}</div>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
              <Link to="/registrations" className="btn btn-primary btn-full" id="view-registrations-after-confirm-btn">
                View All Registrations &rarr;
              </Link>
              <button 
                type="button" 
                className="btn btn-outline btn-full"
                onClick={handleRegisterAnother}
                id="register-another-btn"
              >
                + Register Another Student
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <form 
            onSubmit={handleSubmit(onSubmit, onError)} 
            noValidate 
            id="registration-form"
          >
            {/* Select Event */}
            <div className="form-group">
              <label className="form-label" htmlFor="event_id">
                Select Event <span className="req">*</span>
              </label>
              <select
                id="event_id"
                className={`form-control ${errors.event_id ? 'is-invalid' : ''}`}
                {...register('event_id', {
                  required: 'Please select an event to register for',
                })}
              >
                <option value="">
                  {loadingEvents ? '-- Loading events... --' : '-- Choose an Event --'}
                </option>
                {events.map((ev) => (
                  <option 
                    key={ev.id} 
                    value={String(ev.id)}
                    disabled={ev.available_seats <= 0}
                  >
                    {ev.title} ({ev.available_seats <= 0 ? 'FULL' : `${ev.available_seats} seats remaining`} - {ev.date})
                  </option>
                ))}
              </select>
              {errors.event_id && (
                <div className="form-error" id="error-event-id">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{errors.event_id.message}</span>
                </div>
              )}
            </div>

            {/* Student Full Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="student_name">
                Student Full Name <span className="req">*</span>
              </label>
              <input
                type="text"
                id="student_name"
                className={`form-control ${errors.student_name ? 'is-invalid' : ''}`}
                placeholder="e.g. Rahul Sharma"
                {...register('student_name', {
                  required: 'Student name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters long',
                  },
                })}
              />
              {errors.student_name && (
                <div className="form-error" id="error-student-name">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{errors.student_name.message}</span>
                </div>
              )}
            </div>

            {/* Student Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="student_email">
                Student Email <span className="req">*</span>
              </label>
              <input
                type="email"
                id="student_email"
                className={`form-control ${errors.student_email ? 'is-invalid' : ''}`}
                placeholder="e.g. rahul.sharma@college.edu"
                {...register('student_email', {
                  required: 'Student email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address (e.g. name@college.edu)',
                  },
                })}
              />
              {errors.student_email && (
                <div className="form-error" id="error-student-email">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{errors.student_email.message}</span>
                </div>
              )}
            </div>

            {/* Student ID / Roll Number */}
            <div className="form-group">
              <label className="form-label" htmlFor="student_id">
                Student ID / Roll Number <span className="req">*</span>
              </label>
              <input
                type="text"
                id="student_id"
                className={`form-control ${errors.student_id ? 'is-invalid' : ''}`}
                placeholder="e.g. CS2023001"
                {...register('student_id', {
                  required: 'Student ID is required',
                  minLength: {
                    value: 2,
                    message: 'Student ID must be at least 2 characters',
                  },
                })}
              />
              {errors.student_id && (
                <div className="form-error" id="error-student-id">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{errors.student_id.message}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={isSubmitting}
              id="submit-registration-btn"
              style={{ marginTop: '1rem' }}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" style={{ width: '18px', height: '18px', borderWidth: '2px', margin: '0 6px 0 0', display: 'inline-block' }}></span>
                  Processing Registration...
                </>
              ) : (
                'Confirm Registration'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
