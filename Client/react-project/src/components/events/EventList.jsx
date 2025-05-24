import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { eventAPI } from "../../utils/axios";
import { useAuth } from "../../context/authContext";
import { format } from 'date-fns';
import { useEvents } from '../../context/eventContext';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const { getMyEvents } = useEvents();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getMyEvents();
      console.log('Events response:', response);
      
      let eventsData = [];
      if (response && response.data) {
        if (response.data.data) {
          eventsData = response.data.data;
        } else if (response.data.events) {
          eventsData = response.data.events;
        } else if (Array.isArray(response.data)) {
          eventsData = response.data;
        }
      }
      
      console.log('Parsed events:', eventsData);
      setEvents(Array.isArray(eventsData) ? eventsData : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching events:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-5rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">All Events</h2>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/50 rounded-lg">
          <h3 className="text-xl text-gray-300">No Events Available</h3>
          <p className="text-gray-400 mt-2">Check back later for upcoming events!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {events.map(event => (
            <div
              key={event._id}
              className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 hover:border-indigo-500/50 transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">{event.title}</h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    event.ticketsAvailable > 0 
                      ? 'bg-green-500/20 text-green-500 border-green-500/50' 
                      : 'bg-red-500/20 text-red-500 border-red-500/50'
                  }`}>
                    {event.ticketsAvailable > 0 ? 'Tickets Available' : 'Sold Out'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Date & Time</p>
                    <p className="text-white">{format(new Date(event.date), 'MMM dd, yyyy - h:mm a')}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Location</p>
                    <p className="text-white">{event.location}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-gray-400 text-sm">Price</p>
                    <p className="text-white">${event.ticketPrice}</p>
                  </div>
                </div>

                <p className="mt-4 text-gray-300">{event.description}</p>

                <div className="mt-6 flex items-center justify-end space-x-4">
                  <Link
                    to={`/events/${event._id}`}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;