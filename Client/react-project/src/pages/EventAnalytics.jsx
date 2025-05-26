import React, { useState, useEffect } from 'react';
import { eventAPI } from '../utils/axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EventAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await eventAPI.getEventAnalytics();
        console.log('Analytics Response:', response.data.data);
        setAnalytics(response.data.data);
        setError(null);
      } catch (err) {
        console.error('Analytics Error:', err);
        setError(err.response?.data?.message || 'Failed to fetch analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 m-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
        {error}
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="p-4 m-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-500">
        No analytics data available
      </div>
    );
  }

  // Prepare chart data
  console.log('eventBookingStats:', analytics.eventBookingStats);
  console.log('Chart data:', analytics.eventBookingStats.map(stat => stat.percentBooked));
  const chartData = {
    labels: analytics.eventBookingStats.map(stat => stat.title),
    datasets: [
      {
        label: 'Booking Percentage',
        data: analytics.eventBookingStats.map(stat => {
          const val = Number(stat.percentBooked);
          return isNaN(val) ? 0 : val;
        }),
        backgroundColor: 'rgba(139, 92, 246, 0.6)', // Purple
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e2e8f0', // text-gray-200
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'Event Booking Statistics',
        color: '#e2e8f0', // text-gray-200
        font: {
          size: 18,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)', // bg-gray-900
        titleColor: '#e2e8f0', // text-gray-200
        bodyColor: '#e2e8f0', // text-gray-200
        borderColor: 'rgba(139, 92, 246, 0.5)', // border-purple-500
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            return `Booking Percentage: ${context.raw}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(75, 85, 99, 0.2)', // gray-600 with opacity
        },
        ticks: {
          color: '#e2e8f0', // text-gray-200
          callback: function(value) {
            return value + '%';
          }
        },
        title: {
          display: true,
          text: 'Booking Percentage (%)',
          color: '#e2e8f0', // text-gray-200
        }
      },
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)', // gray-600 with opacity
        },
        ticks: {
          color: '#e2e8f0', // text-gray-200
          maxRotation: 45,
          minRotation: 45
        }
      }
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text mb-8">
        Event Analytics Dashboard
      </h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Total Events</h3>
          <p className="text-3xl font-bold text-white">{analytics.totalEvents}</p>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Tickets Sold</h3>
          <p className="text-3xl font-bold text-white">{analytics.totalTicketsSold}</p>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-white">${analytics.totalRevenue.toFixed(2)}</p>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
          <h3 className="text-gray-400 text-sm font-medium mb-2">Upcoming Events</h3>
          <p className="text-3xl font-bold text-white">{analytics.upcomingEvents.length}</p>
        </div>
      </div>

      {/* Booking Statistics Chart */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 mb-8">
        <div className="h-[400px] relative">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>

      {/* Upcoming Events Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <h3 className="text-xl font-semibold text-white mb-4">Upcoming Events</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Event Title</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Date</th>
                <th className="text-left py-3 px-4 text-gray-400 font-medium">Tickets Available</th>
              </tr>
            </thead>
            <tbody>
              {analytics.upcomingEvents.map((event, index) => (
                <tr key={index} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                  <td className="py-3 px-4 text-white">{event.title}</td>
                  <td className="py-3 px-4 text-gray-300">{new Date(event.date).toLocaleDateString()}</td>
                  <td className="py-3 px-4 text-gray-300">{event.ticketsAvailable}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics; 