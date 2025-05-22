import React, { useEffect, useState } from 'react';
import { getEventAnalytics } from '../../api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { toast } from 'react-toastify';

const EventAnalytics = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getEventAnalytics();
        // Convert API response into recharts format if needed
        const formatted = res.data.map(event => ({
          name: event.title,
          booked: event.bookedTickets,
          available: event.totalTickets - event.bookedTickets,
        }));
        setData(formatted);
      } catch (err) {
        toast.error("Failed to load analytics");
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Event Analytics</h2>
      {data.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="booked" fill="#4ade80" name="Booked Tickets" />
            <Bar dataKey="available" fill="#f87171" name="Available Tickets" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default EventAnalytics;
