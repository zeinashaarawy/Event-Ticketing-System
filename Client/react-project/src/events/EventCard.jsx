import React from 'react';

const EventCard = ({ event, onEdit, onDelete }) => {
  return (
    <div className="border p-4 rounded shadow mb-4">
      <h2 className="text-xl font-bold">{event.title}</h2>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Tickets:</strong> {event.ticketCount}</p>
      <p><strong>Price:</strong> ${event.price}</p>
      <p><strong>Status:</strong> {event.status}</p>
      <div className="mt-2 space-x-2">
        <button onClick={() => onEdit(event)} className="bg-blue-500 text-white px-4 py-1 rounded">Edit</button>
        <button onClick={() => onDelete(event._id)} className="bg-red-500 text-white px-4 py-1 rounded">Delete</button>
      </div>
    </div>
  );
};

export default EventCard;
