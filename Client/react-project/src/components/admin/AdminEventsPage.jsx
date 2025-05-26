import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventAPI } from '../../utils/axios';
import { toast } from 'react-toastify';

const AdminEventsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // Default to showing pending events

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchEvents();
  }, [user, navigate]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      console.log('Fetching events for admin...');
      const response = await eventAPI.getAllEvents();
      console.log('Admin Events API Response:', response);
      const eventsData = Array.isArray(response.data) ? response.data : response.data?.events || [];
      console.log('Processed Events Data:', eventsData);
      console.log('Pending Events:', eventsData.filter(event => event.status === 'pending'));
      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      console.log('Updating event status:', { eventId, newStatus });
      const response = await eventAPI.updateEventStatus(eventId, newStatus);
      console.log('Update status response:', response);
      toast.success(`Event ${newStatus} successfully`);
      fetchEvents(); // Refresh the events list
    } catch (error) {
      console.error('Error updating event status:', {
        error,
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
      toast.error(error.response?.data?.message || 'Failed to update event status');
    }
  };

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Event Management</h1>
          <p className="mt-2 text-gray-400">Review and manage event submissions</p>
        </div>
        <div className="flex gap-4">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-2"
          >
            <option value="pending">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
            <option value="all">All Events</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredEvents.map((event) => (
          <div
            key={event._id}
            className="bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700"
          >
            <div className="flex justify-between items-start">
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(event.status)}`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-400 mb-4">{event.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
                  <div>
                    <span className="font-medium">Date: </span>
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">Location: </span>
                    {event.location}
                  </div>
                  <div>
                    <span className="font-medium">Price: </span>
                    ${event.price}
                  </div>
                </div>
                <div className="mt-2">
                  <span className="text-sm text-gray-400">
                    <span className="font-medium">Available Tickets: </span>
                    {event.ticketsAvailable}
                  </span>
                </div>
              </div>
              
              {event.status === 'pending' && (
                <div className="flex flex-col gap-2 ml-4">
                  <button
                    onClick={() => handleStatusChange(event._id, 'approved')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Approve
                  </button>
                  <button
                    onClick={() => handleStatusChange(event._id, 'declined')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Decline
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No {filter === 'all' ? '' : filter} events found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEventsPage; 