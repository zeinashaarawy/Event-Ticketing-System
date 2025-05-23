import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { eventAPI } from '../../utils/axios';
import { toast } from 'react-toastify';
import BookTicketForm from './BookTicketForm';
import { format } from 'date-fns';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getEventById(id);
      const eventData = response.data;
      
      // Check if the user is the organizer
      const isOrganizer = user && eventData.organizer && user._id === eventData.organizer._id;
      
      // Show all events to organizers, but only approved events to others
      if (!isOrganizer && eventData.status !== 'approved') {
        toast.error('This event is not available for viewing');
        navigate('/events');
        return;
      }
      
      setEvent(eventData);
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch event details');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingSuccess = () => {
    toast.success('Booking successful!');
    fetchEventDetails(); // Refresh event details to update ticket count
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'EEEE, MMMM d, yyyy h:mm a');
  };

  const getStatusBadge = () => {
    if (!event) return null;
    
    const statusClasses = {
      pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
      approved: 'bg-green-500/20 text-green-500 border-green-500/50',
      declined: 'bg-red-500/20 text-red-500 border-red-500/50'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusClasses[event.status]}`}>
        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
      </span>
    );
  };

  const getAvailabilityStatus = () => {
    if (!event) return null;
    
    if (event.ticketsAvailable === 0) {
      return <span className="text-red-500 font-semibold">Sold Out</span>;
    }
    
    const totalTickets = event.ticketsAvailable + (event.totalTickets || 0);
    const percentageLeft = (event.ticketsAvailable / totalTickets) * 100;
    
    if (percentageLeft <= 10) {
      return <span className="text-red-500 font-semibold">Only {event.ticketsAvailable} tickets left!</span>;
    }
    if (percentageLeft <= 25) {
      return <span className="text-orange-500 font-semibold">Selling Fast!</span>;
    }
    
    return <span className="text-green-500 font-semibold">{event.ticketsAvailable} tickets available</span>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!event) {
    return null;
  }

  const isOrganizer = user && event.organizer && user._id === event.organizer._id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-700">
        <div className="relative h-96">
          <img
            src={event.imageUrl || 'https://via.placeholder.com/1200x400'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-bold text-white">{event.title}</h1>
              {isOrganizer && getStatusBadge()}
            </div>
            <div className="flex items-center space-x-4 text-white/80">
              <span>{formatDate(event.date)}</span>
              <span>•</span>
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Information */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">About This Event</h2>
                <p className="text-gray-300 whitespace-pre-line">{event.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-300 mb-1">Organizer</h3>
                  <p className="text-white">{event.organizer?.name || 'Unknown'}</p>
                </div>
                <div className="bg-gray-700/50 p-4 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-300 mb-1">Category</h3>
                  <p className="text-white capitalize">{event.category}</p>
                </div>
              </div>

              {/* Ticket Availability Progress */}
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium text-gray-300">Ticket Availability</h3>
                  {getAvailabilityStatus()}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-fuchsia-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(event.ticketsAvailable / (event.ticketsAvailable + (event.totalTickets || 0))) * 100}%` 
                    }}
                  />
                </div>
                <div className="flex justify-between mt-2 text-xs text-gray-400">
                  <span>{event.ticketsAvailable} available</span>
                  <span>{(event.totalTickets || 0) - event.ticketsAvailable} sold</span>
                </div>
              </div>
            </div>

            {/* Booking Section */}
            <div className="lg:col-span-1">
              <div className="bg-gray-700/50 p-6 rounded-lg sticky top-24">
                <h2 className="text-xl font-semibold text-white mb-4">Book Tickets</h2>
                
                <div className="mb-6">
                  <div className="flex justify-between items-baseline">
                    <p className="text-3xl font-bold text-white">
                      ${event.ticketPrice.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400">per ticket</p>
                  </div>
                </div>

                {user ? (
                  event.status === 'approved' ? (
                    event.ticketsAvailable > 0 ? (
                      <BookTicketForm
                        eventId={id}
                        maxTickets={Math.min(10, event.ticketsAvailable)}
                        ticketPrice={event.ticketPrice}
                        onSuccess={handleBookingSuccess}
                      />
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-red-500 font-semibold text-lg mb-2">Sold Out</p>
                        <p className="text-gray-400">Sorry, there are no more tickets available for this event.</p>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-300 mb-2">This event is not yet available for booking</p>
                      <p className="text-gray-400">Please wait for admin approval</p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-4">
                    <p className="text-gray-300 mb-4">Please log in to book tickets</p>
                    <button
                      onClick={() => navigate('/login', { state: { from: `/events/${id}` } })}
                      className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Log In to Book
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails; 
