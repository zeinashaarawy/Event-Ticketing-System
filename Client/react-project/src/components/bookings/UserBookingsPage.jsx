import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingAPI } from '../../utils/axios';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const UserBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to view your bookings');
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [isAuthenticated, user, navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getUserBookings();
      setBookings(response.data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch your bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await bookingAPI.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      fetchBookings(); // Refresh the bookings list
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const handleViewDetails = (bookingId) => {
    navigate(`/bookings/${bookingId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-5rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 rounded-lg">
          <h3 className="text-xl text-gray-300">No Bookings Found</h3>
          <p className="text-gray-400 mt-2">You haven't made any bookings yet.</p>
          <button
            onClick={() => navigate('/events')}
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Browse Events
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 hover:border-indigo-500/50 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">
                      {booking.event.title}
                    </h2>
                    <p className="text-gray-400">
                      Booked on {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleViewDetails(booking._id)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Event Date</p>
                    <p className="text-white">
                      {format(new Date(booking.event.date), 'MMM dd, yyyy - h:mm a')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Tickets</p>
                    <p className="text-white">{booking.quantity} tickets</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Price</p>
                    <p className="text-white">${booking.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookingsPage; 
