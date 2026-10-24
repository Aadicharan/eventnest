import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { createEvent } from '../services/api';
import Alert from '../components/Alert';

export default function CreateEvent() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [createdEventId, setCreatedEventId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      date: '',
      time: '',
      venue: '',
      max_participants: '',
    },
  });

  const onSubmit = async (formData) => {
    setSubmitError(null);
    setSubmitSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await createEvent({
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        venue: formData.venue,
        max_participants: parseInt(formData.max_participants, 10),
      });

      setSubmitSuccess(response.message || 'Event created successfully!');
      if (response.event && response.event.id) {
        setCreatedEventId(response.event.id);
      }
      reset();
    } catch (err) {
      console.error('Failed to create event:', err);
      setSubmitError(err.message || 'An error occurred while creating the event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onError = (formErrors) => {
    console.warn('Create event validation errors:', formErrors);
    const firstKey = Object.keys(formErrors)[0];
    if (firstKey && formErrors[firstKey]?.message) {
      setSubmitError(`Please fix: ${formErrors[firstKey].message}`);
    } else {
      setSubmitError('Please complete all required fields marked with an asterisk (*).');
    }
  };

  return (
    <div className="container">
      <div className="form-card">
        <div className="form-header">
          <h2>Create College Event</h2>
          <p>Publish an official campus event for students to discover and register.</p>
        </div>

        {submitSuccess && (
          <div style={{ marginBottom: '1.5rem' }}>
            <Alert type="success" message={submitSuccess} onClose={() => setSubmitSuccess(null)} />
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem' }}>
              {createdEventId && (
                <Link to={`/events/${createdEventId}`} className="btn btn-outline" style={{ flex: 1 }}>
                  View Created Event &rarr;
                </Link>
              )}
              <Link to="/events" className="btn btn-secondary" style={{ flex: 1, color: 'var(--text-main)' }}>
                Back to All Events
              </Link>
            </div>
          </div>
        )}

        {submitError && (
          <Alert type="danger" message={submitError} onClose={() => setSubmitError(null)} />
        )}

        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate id="create-event-form">
          {/* Event Title */}
          <div className="form-group">
            <label className="form-label" htmlFor="title">
              Event Title <span className="req">*</span>
            </label>
            <input
              type="text"
              id="title"
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              placeholder="e.g. Annual Tech Symposium 2026"
              {...register('title', {
                required: 'Event title is required',
                minLength: {
                  value: 3,
                  message: 'Title must be at least 3 characters',
                },
              })}
            />
            {errors.title && (
              <div className="form-error" id="error-title">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errors.title.message}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label" htmlFor="description">
              Description <span className="req">*</span>
            </label>
            <textarea
              id="description"
              rows="4"
              className={`form-control ${errors.description ? 'is-invalid' : ''}`}
              placeholder="Provide a comprehensive summary of the event, agenda, and expectations..."
              {...register('description', {
                required: 'Description is required',
                minLength: {
                  value: 10,
                  message: 'Description must be at least 10 characters long',
                },
              })}
            ></textarea>
            {errors.description && (
              <div className="form-error" id="error-description">
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>{errors.description.message}</span>
              </div>
            )}
          </div>

          {/* Date & Time Row */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="date">
                Event Date <span className="req">*</span>
              </label>
              <input
                type="date"
                id="date"
                className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                {...register('date', {
                  required: 'Event date is required',
                })}
              />
              {errors.date && (
                <div className="form-error" id="error-date">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{errors.date.message}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="time">
                Event Time <span className="req">*</span>
              </label>
              <input
                type="text"
                id="time"
                placeholder="e.g. 10:00 AM"
                className={`form-control ${errors.time ? 'is-invalid' : ''}`}
                {...register('time', {
                  required: 'Event time is required',
                })}
              />
              {errors.time && (
                <div className="form-error" id="error-time">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{errors.time.message}</span>
                </div>
              )}
            </div>
          </div>

          {/* Venue & Capacity Row */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="venue">
                Venue Location <span className="req">*</span>
              </label>
              <input
                type="text"
                id="venue"
                className={`form-control ${errors.venue ? 'is-invalid' : ''}`}
                placeholder="e.g. Main Auditorium"
                {...register('venue', {
                  required: 'Venue is required',
                })}
              />
              {errors.venue && (
                <div className="form-error" id="error-venue">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{errors.venue.message}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="max_participants">
                Max Participants <span className="req">*</span>
              </label>
              <input
                type="number"
                id="max_participants"
                className={`form-control ${errors.max_participants ? 'is-invalid' : ''}`}
                placeholder="e.g. 50"
                min="1"
                {...register('max_participants', {
                  required: 'Maximum participants is required',
                  min: {
                    value: 1,
                    message: 'Maximum participants must be greater than 0',
                  },
                  validate: (value) =>
                    parseInt(value, 10) > 0 || 'Maximum participants must be greater than 0',
                })}
              />
              {errors.max_participants && (
                <div className="form-error" id="error-max-participants">
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{errors.max_participants.message}</span>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={isSubmitting}
            id="submit-create-event-btn"
            style={{ marginTop: '1rem' }}
          >
            {isSubmitting ? 'Creating Event...' : 'Publish Event'}
          </button>
        </form>
      </div>
    </div>
  );
}
