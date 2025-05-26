import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/eventContext';
import { eventAPI } from '../../utils/axios';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const { getMyEvents } = useEvents();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    
    if (user.role !== 'organizer' && user.role !== 'admin') {
      toast.error('Access denied. Only event organizers can view this page.');
      navigate('/events');
      return;
    }

    fetchMyEvents();
  }, [isAuthenticated, user, navigate, getMyEvents]);

  const fetchMyEvents = async () => {
    try {
      setLoading(true);
      const response = await getMyEvents();
      console.log('Fetched my events response:', response);
      
      // Handle the response data structure
      const eventsData = response.events || response.data?.events || response;
      setEvents(Array.isArray(eventsData) ? eventsData : []);
    } catch (error) {
      console.error('Error in fetchMyEvents:', error);
      toast.error(error.response?.data?.message || error.message || 'Failed to fetch your events');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    // Show confirmation dialog
    if (!window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    try {
      await eventAPI.deleteEvent(eventId);
      
      // Update local state
      setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
      
      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Delete event error:', error);
      
      if (error.response?.status === 401) {
        toast.error('Please login to continue');
        navigate('/login');
      } else if (error.response?.status === 403) {
        toast.error('You do not have permission to delete this event');
      } else if (error.response?.status === 404) {
        toast.error('Event not found');
        // Remove from local state if the event doesn't exist anymore
        setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
      } else {
        toast.error(error.response?.data?.message || 'Failed to delete event');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
      approved: 'bg-green-500/20 text-green-500 border-green-500/50',
      declined: 'bg-red-500/20 text-red-500 border-red-500/50'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusClasses[status] || statusClasses.pending}`}>
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Pending'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-5rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">My Events</h1>
        <Link
          to="/create-event"
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-medium hover:from-indigo-700 hover:to-fuchsia-700 transition-all duration-200"
        >
          Create New Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 rounded-lg">
          <h3 className="text-xl text-gray-300">No Events Created</h3>
          <p className="text-gray-400 mt-2">Start by creating your first event!</p>
          <Link
            to="/create-event"
            className="inline-block mt-4 px-6 py-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-200"
          >
            Create Event
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {events.map(event => (
            <div
              key={event._id}
              className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 hover:border-indigo-500/50 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">{event.title}</h2>
                  {getStatusBadge(event.status)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Date & Time</p>
                    <p className="text-white">{format(new Date(event.date), 'MMM dd, yyyy - h:mm a')}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Location</p>
                    <p className="text-white">{event.location}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Tickets</p>
                    <p className="text-white">
                      {event.ticketsAvailable} available / {event.capacity} total
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-end space-x-4">
                  <Link
                    to={`/events/${event._id}`}
                    className="px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    View Details
                  </Link>
                  <Link
                    to={`/events/${event._id}/analytics`}
                    className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Analytics
                  </Link>
                  <Link
                    to={`/events/${event._id}/edit`}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteEvent(event._id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents; 