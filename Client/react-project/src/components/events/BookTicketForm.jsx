import { useState } from 'react';
import { toast } from 'react-toastify';
import { bookingAPI } from '../../utils/axios';

const BookTicketForm = ({ eventId, maxTickets, ticketPrice, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await bookingAPI.bookTickets(eventId, {
        quantity: parseInt(quantity),
        totalPrice: quantity * ticketPrice
      });
      
      toast.success('Tickets booked successfully!');
      onSuccess();
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Failed to book tickets');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-2">
          Number of Tickets
        </label>
        <select
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {[...Array(maxTickets)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1} {i === 0 ? 'ticket' : 'tickets'}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Price per ticket:</span>
          <span className="text-white">${ticketPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Quantity:</span>
          <span className="text-white">× {quantity}</span>
        </div>
        <div className="pt-2 border-t border-gray-700">
          <div className="flex justify-between">
            <span className="text-sm font-medium text-gray-300">Total:</span>
            <span className="text-lg font-bold text-white">
              ${(quantity * ticketPrice).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-medium hover:from-indigo-700 hover:to-fuchsia-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Booking...
          </div>
        ) : (
          'Book Now'
        )}
      </button>

      <p className="text-xs text-gray-400 text-center">
        By clicking "Book Now", you agree to our terms and conditions.
      </p>
    </form>
  );
};

export default BookTicketForm; 
