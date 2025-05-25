import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/authContext';
import { eventAPI } from '../../utils/axios';
import { toast } from 'react-toastify';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const EventAnalytics = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalTickets: 0,
    ticketsSold: 0,
    revenue: 0,
    percentageSold: 0,
    ticketPrice: 0,
    availableTickets: 0
  });

  useEffect(() => {
    if (!isAuthenticated || !user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    
    if (user.role !== 'organizer' && user.role !== 'admin') {
      toast.error('Access denied. Only event organizers can view analytics.');
      navigate('/events');
      return;
    }

    fetchEventAnalytics();
  }, [isAuthenticated, user, navigate, id]);

  const fetchEventAnalytics = async () => {
    try {
      setLoading(true);
      
      const eventResponse = await eventAPI.getEventById(id);
      console.log('Raw Event Response:', eventResponse);

      if (!eventResponse?.data) {
        throw new Error('No data received from server');
      }

      let eventData;
      if (eventResponse.data.event) {
        eventData = eventResponse.data.event;
      } else if (eventResponse.data.data) {
        eventData = eventResponse.data.data;
      } else if (typeof eventResponse.data === 'object') {
        eventData = eventResponse.data;
      } else {
        throw new Error('Invalid event data format');
      }

      console.log('Parsed Event Data:', {
        title: eventData.title,
        ticketsAvailable: eventData.ticketsAvailable,
        initialTickets: eventData.initialTickets,
        capacity: eventData.capacity,
        ticketPrice: eventData.ticketPrice,
        fullData: eventData
      });

      if (!eventData) {
        throw new Error('Event not found');
      }

      // Calculate analytics with proper validation
      const initialCapacity = parseInt(eventData.initialTickets || eventData.capacity || 0, 10);
      const availableTickets = parseInt(eventData.ticketsAvailable || 0, 10);
      const soldTickets = Math.max(0, initialCapacity - availableTickets);
      const ticketPrice = parseFloat(eventData.ticketPrice || 0);
      const revenue = soldTickets * ticketPrice;
      const totalTickets = initialCapacity;
      const percentageSold = totalTickets > 0 ? (soldTickets / totalTickets) * 100 : 0;

      console.log('Analytics Calculation Steps:', {
        step1_initialCapacity: initialCapacity,
        step2_availableTickets: availableTickets,
        step3_soldTickets: soldTickets,
        step4_ticketPrice: ticketPrice,
        step5_revenue: revenue,
        step6_totalTickets: totalTickets,
        step7_percentageSold: percentageSold
      });

      setEvent(eventData);
      setAnalytics({
        totalTickets,
        ticketsSold: soldTickets,
        revenue,
        percentageSold,
        ticketPrice,
        availableTickets
      });

      console.log('Final Analytics State:', {
        totalTickets,
        ticketsSold: soldTickets,
        revenue,
        percentageSold,
        ticketPrice,
        availableTickets
      });

      setLoading(false);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      let errorMessage = 'Failed to load event analytics.';
      
      if (error.response) {
        console.error('Server response error:', {
          status: error.response.status,
          data: error.response.data
        });

        if (error.response.status === 404) {
          errorMessage = 'Event not found.';
        } else if (error.response.status === 401) {
          errorMessage = 'Please login to view analytics.';
          navigate('/login');
          return;
        } else if (error.response.status === 403) {
          errorMessage = 'You do not have permission to view this event\'s analytics.';
          navigate('/my-events');
          return;
        }
      }
      
      toast.error(errorMessage);
      if (!error.response?.status || error.response.status !== 401) {
        navigate('/my-events');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl text-gray-400 mb-4">Event not found or unable to load analytics</p>
        <button
          onClick={() => navigate('/my-events')}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Back to My Events
        </button>
      </div>
    );
  }

  const barChartData = {
    labels: ['Total Tickets', 'Tickets Sold', 'Tickets Available'],
    datasets: [
      {
        label: 'Ticket Statistics',
        data: [
          analytics.totalTickets,
          analytics.ticketsSold,
          analytics.availableTickets
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  const pieChartData = {
    labels: ['Sold', 'Available'],
    datasets: [
      {
        data: [
          analytics.ticketsSold,
          analytics.availableTickets
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.5)',
          'rgba(255, 99, 132, 0.5)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{event.title} - Analytics</h1>
            <p className="text-gray-400">{event.description}</p>
          </div>
          <button
            onClick={() => navigate('/my-events')}
            className="px-4 py-2 text-sm bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-200 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-500">
            ${analytics.revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-gray-400 mt-1">@ ${analytics.ticketPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} per ticket</p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-200 mb-2">Tickets Sold</h3>
          <p className="text-3xl font-bold text-blue-500">{analytics.ticketsSold.toLocaleString()}</p>
          <p className="text-sm text-gray-400 mt-1">of {analytics.totalTickets.toLocaleString()} total</p>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-200 mb-2">Sell-through Rate</h3>
          <p className="text-3xl font-bold text-purple-500">{analytics.percentageSold.toFixed(1)}%</p>
          <p className="text-sm text-gray-400 mt-1">{analytics.availableTickets.toLocaleString()} tickets remaining</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-200 mb-4">Ticket Distribution</h3>
          <Bar 
            data={barChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                  labels: {
                    color: 'rgb(156, 163, 175)'
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  min: 0,
                  grid: {
                    color: 'rgba(75, 85, 99, 0.2)'
                  },
                  ticks: {
                    color: 'rgb(156, 163, 175)',
                    stepSize: 1
                  }
                },
                x: {
                  grid: {
                    color: 'rgba(75, 85, 99, 0.2)'
                  },
                  ticks: {
                    color: 'rgb(156, 163, 175)'
                  }
                }
              }
            }}
          />
        </div>

        <div className="bg-gray-800/50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-200 mb-4">Sales Distribution</h3>
          <Pie 
            data={pieChartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                  position: 'top',
                  labels: {
                    color: 'rgb(156, 163, 175)'
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics; 