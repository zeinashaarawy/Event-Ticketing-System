import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { eventAPI } from '../../utils/axios';
import { toast } from 'react-toastify';

const EditEvent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    ticketPrice: '',
    ticketsAvailable: '',
    status: 'pending'
  });

  // Check authentication and role
  useEffect(() => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    
    if (user.role !== 'organizer' && user.role !== 'admin') {
      toast.error('Access denied. Only event organizers can edit events.');
      navigate('/events');
      return;
    }

    fetchEventDetails();
  }, [isAuthenticated, user, navigate, id]);

  const fetchEventDetails = async () => {
    try {
      const response = await eventAPI.getEventById(id);
      const event = response.data;

      // Check if the user is authorized to edit this event
      if (event.organizer !== user.id && user.role !== 'admin') {
        toast.error('You are not authorized to edit this event');
        navigate('/my-events');
        return;
      }

      // Convert date to local date and time strings
      const eventDate = new Date(event.date);
      const dateString = eventDate.toISOString().split('T')[0];
      const timeString = eventDate.toTimeString().slice(0, 5);

      setFormData({
        title: event.title,
        description: event.description,
        date: dateString,
        time: timeString,
        location: event.location,
        ticketPrice: event.ticketPrice,
        ticketsAvailable: event.ticketsAvailable,
        status: event.status
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Failed to fetch event details');
      navigate('/my-events');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const now = new Date();
    const eventDate = new Date(`${formData.date}T${formData.time}`);
    
    if (eventDate < now) {
      toast.error('Event date and time must be in the future');
      return false;
    }

    if (parseFloat(formData.ticketPrice) < 0) {
      toast.error('Ticket price cannot be negative');
      return false;
    }

    if (parseInt(formData.ticketsAvailable) < 1) {
      toast.error('Total tickets must be at least 1');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Combine date and time
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      
      // Create the event data object
      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        date: dateTime.toISOString(),
        location: formData.location.trim(),
        ticketsAvailable: parseInt(formData.ticketsAvailable),
        ticketPrice: parseFloat(formData.ticketPrice),
        status: formData.status
      };

      // Log the data being sent
      console.log('Sending updated event data:', eventData);

      const response = await eventAPI.updateEvent(id, eventData);
      console.log('Event update response:', response);

      toast.success('Event updated successfully!');
      navigate('/my-events');
    } catch (error) {
      console.error('Update event error:', error);
      toast.error(error.message || 'Failed to update event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-700">
        <h2 className="text-3xl font-bold text-white mb-6">Edit Event</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Event Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Enter event title"
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                required
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Describe your event"
              />
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Time */}
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-2">
                Time
              </label>
              <input
                type="time"
                id="time"
                name="time"
                required
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Event location"
              />
            </div>

            {/* Ticket Price */}
            <div>
              <label htmlFor="ticketPrice" className="block text-sm font-medium text-gray-300 mb-2">
                Ticket Price ($)
              </label>
              <input
                type="number"
                id="ticketPrice"
                name="ticketPrice"
                required
                min="0"
                step="0.01"
                value={formData.ticketPrice}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>

            {/* Tickets Available */}
            <div>
              <label htmlFor="ticketsAvailable" className="block text-sm font-medium text-gray-300 mb-2">
                Available Tickets
              </label>
              <input
                type="number"
                id="ticketsAvailable"
                name="ticketsAvailable"
                required
                min="1"
                value={formData.ticketsAvailable}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Number of tickets"
              />
            </div>

            {/* Status (only visible to admin) */}
            {user.role === 'admin' && (
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  required
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => navigate('/my-events')}
              className="px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Updating...' : 'Update Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEvent;
