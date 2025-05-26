import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { eventAPI } from '../utils/axios';

// Create the context
const EventContext = createContext();

// Custom hook for using the event context
const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

// Export the provider component
export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventAPI.getAllEvents();
      const eventsList = Array.isArray(response.data) ? response.data : response.data.events || [];
      setEvents(eventsList);
    } catch (error) {
      console.error('Fetch events error:', error);
      setError(error.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData) => {
    try {
      console.log('Creating event with data:', eventData);

      // Validate required fields
      const requiredFields = ['title', 'description', 'date', 'location', 'ticketsAvailable', 'ticketPrice'];
      for (const field of requiredFields) {
        if (!eventData[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      console.log('Calling eventAPI.createEvent with data:', eventData);
      const response = await eventAPI.createEvent(eventData);
      console.log('Create event API response:', response);

      if (!response) {
        throw new Error('No response from server');
      }

      if (!response.data) {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response from server');
      }

      const newEvent = response.data.event || response.data;
      console.log('New event created:', newEvent);
      
      // Ensure we're working with arrays
      setEvents(prevEvents => {
        const currentEvents = Array.isArray(prevEvents) ? prevEvents : [];
        return [...currentEvents, newEvent];
      });
      
      return newEvent;
    } catch (error) {
      console.error('Create event error:', error);
      
      // Enhanced error handling
      if (error.response) {
        console.error('Server response error:', {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
        
        if (error.response.status === 413) {
          throw new Error('Image file is too large (max 5MB)');
        } else if (error.response.status === 415) {
          throw new Error('Invalid file type (only images allowed)');
        } else if (error.response.status === 400) {
          throw new Error(error.response.data.message || 'Invalid event data');
        } else if (error.response.status === 401) {
          throw new Error('Please login to create an event');
        } else if (error.response.status === 500) {
          console.error('Server error details:', error.response.data);
          throw new Error('Server error. Please try again later.');
        }
      }
      
      throw error;
    }
  };

  const getMyEvents = async () => {
    try {
      const response = await eventAPI.getMyEvents();
      if (!response || !response.data) {
        throw new Error('No data received from server');
      }
      // Handle different response structures
      if (response.data.events) {
        return response.data.events;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error('Get my events error:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const value = {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    getEventById: async (eventId) => {
      try {
        const response = await eventAPI.getEventById(eventId);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    updateEvent: async (eventId, eventData) => {
      try {
        const response = await eventAPI.updateEvent(eventId, eventData);
        setEvents(prevEvents => {
          const currentEvents = Array.isArray(prevEvents) ? prevEvents : [];
          return currentEvents.map(event => 
            event._id === eventId ? response.data : event
          );
        });
        return response.data;
      } catch (error) {
        throw error;
      }
    },
    deleteEvent: async (eventId) => {
      try {
        await eventAPI.deleteEvent(eventId);
        setEvents(prevEvents => {
          const currentEvents = Array.isArray(prevEvents) ? prevEvents : [];
          return currentEvents.filter(event => event._id !== eventId);
        });
      } catch (error) {
        throw error;
      }
    },
    getMyEvents
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

export { useEvents }; 
