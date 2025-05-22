import React, { useEffect, useState } from 'react';
import { getMyEvents, deleteEvent } from '../../../src/api';
import EventCard from './EventCard';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const MyEventsPage = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getMyEvents();
      setEvents(res.data.events);
    } catch (err) {
      toast.error("Failed to load events");
    }
  };

  const handleEdit = (event) => {
    navigate(`/my-events/${event._id}/edit`, { state: { event } });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await deleteEvent(id);
      toast.success("Event deleted");
      fetchEvents(); // Refresh the list
    } catch (err) {
      toast.error("Failed to delete event");
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">My Events</h1>
        <button onClick={() => navigate('/my-events/new')} className="bg-green-500 text-white px-4 py-2 rounded">
          + Create New Event
        </button>
      </div>
      {events.map((event) => (
        <EventCard key={event._id} event={event} onEdit={handleEdit} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default MyEventsPage;
