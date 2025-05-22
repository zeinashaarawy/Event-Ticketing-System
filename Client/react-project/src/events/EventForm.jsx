import React, { useEffect, useState } from 'react';
import { eventsAPI } from '../services/api';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EventForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Only exists in edit mode

  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    ticketCount: '',
    price: '',
  });

  useEffect(() => {
    if (isEditMode && location.state?.event) {
      const { title, date, location: loc, ticketCount, price } = location.state.event;
      setFormData({
        title,
        date: date.split('T')[0],
        location: loc,
        ticketCount,
        price,
      });
    }
  }, [location, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        await eventsAPI.updateEvent(id, formData);
        toast.success('Event updated successfully');
      } else {
        await eventsAPI.createEvent(formData);
        toast.success('Event created successfully');
      }
      navigate('/my-events');
    } catch (err) {
      toast.error('Failed to save event');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit Event' : 'Create Event'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="number" name="ticketCount" placeholder="Ticket Count" value={formData.ticketCount} onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="w-full border p-2 rounded" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {isEditMode ? 'Update Event' : 'Create Event'}
        </button>
      </form>
    </div>
  );
};

export default EventForm;
