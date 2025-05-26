import React, { useState, useEffect } from 'react';
import { bookingAPI } from '../utils/axios';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const UserBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingAPI.getUserBookings();
      console.log('API Response:', response.data); // Debug log
      
      // Check if response.data is an array, if not, try to access the correct property
      const bookingsData = Array.isArray(response.data) 
        ? response.data 
        : response.data?.bookings || [];
      
      console.log('Processed Bookings Data:', bookingsData); // Debug log
      console.log('First Booking Event:', bookingsData[0]?.event); // Debug log
      
      setBookings(bookingsData);
      setError(null);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to fetch bookings. Please try again later.');
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingAPI.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      // Refresh the bookings list
      fetchUserBookings();
    } catch (err) {
      console.error('Error cancelling booking:', err);
      toast.error('Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Ensure bookings is an array before mapping
  if (!Array.isArray(bookings)) {
    console.error('Bookings is not an array:', bookings);
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">Error: Invalid data format</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-white">My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="text-center text-gray-400">
          <p>You haven't made any bookings yet.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-white">
                    {booking.event?.title || 'Event Name Not Available'}
                  </h2>
                  <div className="mt-2 space-y-1 text-gray-300">
                    <p>
                      <span className="font-medium">Date:</span>{' '}
                      {booking.event?.date ? format(new Date(booking.event.date), 'PPP') : 'Date not available'}
                    </p>
                    <p>
                      <span className="font-medium">Time:</span>{' '}
                      {booking.event?.date ? format(new Date(booking.event.date), 'p') : 'Time not available'}
                    </p>
                    <p>
                      <span className="font-medium">Location:</span>{' '}
                      {booking.event?.location || 'Location not available'}
                    </p>
                    <p>
                      <span className="font-medium">Quantity:</span>{' '}
                      {booking.quantity || 0} tickets
                    </p>
                    <p>
                      <span className="font-medium">Total Price:</span>{' '}
                      ${((booking.quantity || 0) * (booking.event?.ticketPrice || 0)).toFixed(2)}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{' '}
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Unknown'}
                      </span>
                    </p>
                  </div>
                </div>
                
                {booking.status !== 'cancelled' && (
                  <button
                    onClick={() => handleCancelBooking(booking._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookingsPage; 