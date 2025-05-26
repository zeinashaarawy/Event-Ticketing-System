import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingAPI } from '../utils/axios';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingAPI.getBookingById(id)
      .then(res => setBooking(res.data.booking))
      .catch(() => navigate('/my-bookings'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <div className="text-center text-white py-8">Loading...</div>;
  if (!booking) return null;

  return (
    <div className="max-w-xl mx-auto bg-gray-900 rounded-lg shadow-lg p-8 mt-8 text-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-white">Booking Details</h2>
      <div className="space-y-2">
        <div><span className="font-semibold">Event:</span> {booking.event?.title}</div>
        <div><span className="font-semibold">Date:</span> {booking.event?.date ? new Date(booking.event.date).toLocaleString() : 'N/A'}</div>
        <div><span className="font-semibold">Location:</span> {booking.event?.location}</div>
        <div><span className="font-semibold">Quantity:</span> {booking.quantity}</div>
        <div><span className="font-semibold">Total Price:</span> ${booking.totalPrice?.toFixed(2)}</div>
        <div><span className="font-semibold">Status:</span> {booking.status}</div>
        <div><span className="font-semibold">Booked At:</span> {booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'N/A'}</div>
      </div>
      <button
        onClick={() => navigate('/my-bookings')}
        className="mt-6 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
      >
        Back to My Bookings
      </button>
    </div>
  );
};

export default BookingDetails; 