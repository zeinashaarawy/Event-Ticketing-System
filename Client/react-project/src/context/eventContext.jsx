import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/axios';

const EventContext = createContext(null);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getAllEvents();
      const eventsList = Array.isArray(response.data) ? response.data : response.data.data;
      setEvents(eventsList || []);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch events';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getEventById = async (eventId) => {
    try {
      const response = await api.getEventById(eventId);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch event details';
      toast.error(errorMessage);
      throw error;
    }
  };

  const createEvent = async (eventData) => {
    try {
      const response = await api.createEvent(eventData);
      setEvents(prev => [...prev, response.data]);
      toast.success('Event created successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create event';
      toast.error(errorMessage);
      throw error;
    }
  };

  const updateEvent = async (eventId, eventData) => {
    try {
      const response = await api.updateEvent(eventId, eventData);
      setEvents(prev => prev.map(event => 
        event._id === eventId ? response.data : event
      ));
      toast.success('Event updated successfully');
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update event';
      toast.error(errorMessage);
      throw error;
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      await api.deleteEvent(eventId);
      setEvents(prev => prev.filter(event => event._id !== eventId));
      toast.success('Event deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete event';
      toast.error(errorMessage);
      throw error;
    }
  };

  // For event organizers
  const getMyEvents = async () => {
    try {
      const response = await api.getEventsByOrganizer();
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch your events';
      toast.error(errorMessage);
      throw error;
    }
  };

  // For admins
  const getAllEventsAdmin = async () => {
    try {
      const response = await api.getAllEventsAdmin();
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch all events';
      toast.error(errorMessage);
      throw error;
    }
  };

  const value = {
    events,
    loading,
    error,
    fetchEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    getMyEvents,
    getAllEventsAdmin
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}; 
