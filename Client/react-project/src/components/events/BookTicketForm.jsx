import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { eventAPI } from '../../utils/axios';
import { toast } from 'react-toastify';

const BookTicketForm = ({ eventId, maxTickets, ticketPrice, onSuccess }) => {
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= maxTickets) {
      setQuantity(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to book tickets');
      return;
    }

    try {
      setLoading(true);
      await eventAPI.bookTickets(eventId, { quantity });
      onSuccess();
    } catch (error) {
      console.error('Error booking tickets:', error);
      toast.error(error.response?.data?.message || 'Failed to book tickets');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-300 mb-1">
          Number of Tickets
        </label>
        <input
          type="number"
          id="quantity"
          min="1"
          max={maxTickets}
          value={quantity}
          onChange={handleQuantityChange}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <p className="mt-1 text-sm text-gray-400">
          Maximum {maxTickets} tickets per booking
        </p>
      </div>

      <div className="border-t border-gray-700 pt-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-300">Subtotal</span>
          <span className="text-white">${(quantity * ticketPrice).toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-300">Service Fee</span>
          <span className="text-white">$0.00</span>
        </div>
        <div className="flex justify-between font-semibold text-lg">
          <span className="text-white">Total</span>
          <span className="text-white">${(quantity * ticketPrice).toFixed(2)}</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
          loading
            ? 'bg-indigo-600/50 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
        }`}
      >
        {loading ? 'Processing...' : 'Book Now'}
      </button>
    </form>
  );
};

export default BookTicketForm; 