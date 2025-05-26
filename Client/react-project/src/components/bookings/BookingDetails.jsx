  import { useState, useEffect } from 'react';
  import { useParams, useNavigate } from 'react-router-dom';
  import { bookingAPI } from '../../utils/axios';
  import { useAuth } from '../../context/AuthContext';
  import { toast } from 'react-toastify';
  import { format } from 'date-fns';

  const BookingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!isAuthenticated || !user) {
        toast.error('Please login to view booking details');
        navigate('/login');
        return;
      }
      fetchBookingDetails();
    }, [id, isAuthenticated, user, navigate]);

    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const response = await bookingAPI.getBookingById(id);
        setBooking(response.data.booking);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        toast.error('Failed to fetch booking details');
        navigate('/bookings');
      } finally {
        setLoading(false);
      }
    };

    const handleCancelBooking = async () => {
      if (!window.confirm('Are you sure you want to cancel this booking?')) {
        return;
      }

      try {
        await bookingAPI.cancelBooking(id);
        toast.success('Booking cancelled successfully');
        navigate('/bookings');
      } catch (error) {
        console.error('Error cancelling booking:', error);
        toast.error(error.response?.data?.message || 'Failed to cancel booking');
      }
    };

    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-[calc(100vh-5rem)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      );
    }

    if (!booking) {
      return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12 bg-gray-800/50 rounded-lg">
            <h3 className="text-xl text-gray-300">Booking Not Found</h3>
            <p className="text-gray-400 mt-2">This booking doesn't exist or has been cancelled.</p>
            <button
              onClick={() => navigate('/bookings')}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Back to My Bookings
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Booking Details</h1>
                <p className="text-gray-400">
                  Booking ID: {booking._id}
                </p>
              </div>
              <button
                onClick={() => navigate('/bookings')}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Bookings
              </button>
            </div>

            <div className="space-y-6">
              {/* Event Details */}
              <div className="border-b border-gray-700 pb-6">
                <h2 className="text-xl font-semibold text-white mb-4">Event Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Event Name</p>
                    <p className="text-white">{booking.event.title}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Event Date</p>
                    <p className="text-white">
                      {format(new Date(booking.event.date), 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Event Time</p>
                    <p className="text-white">
                      {format(new Date(booking.event.date), 'h:mm a')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="text-white">{booking.event.location}</p>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="border-b border-gray-700 pb-6">
                <h2 className="text-xl font-semibold text-white mb-4">Booking Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Booking Date</p>
                    <p className="text-white">
                      {format(new Date(booking.createdAt), 'MMMM d, yyyy')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Number of Tickets</p>
                    <p className="text-white">{booking.quantity} tickets</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Price per Ticket</p>
                    <p className="text-white">${(booking.totalPrice / booking.quantity).toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Amount</p>
                    <p className="text-white font-semibold">${booking.totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end">
                <button
                  onClick={handleCancelBooking}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default BookingDetails; 
