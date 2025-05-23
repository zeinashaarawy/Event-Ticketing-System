import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return api.post('/auth/logout');
  },
  getProfile: () => api.get('/users/me'),
  forgetPassword: (email) => api.put('/auth/forgetPassword', { email }),
  verifyOtpAndResetPassword: (data) => api.put('/auth/verifyOtpAndResetPassword', data),
};

// Events API calls
export const eventsAPI = {
  getAllEvents: () => api.get('/events'),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => api.post('/events', eventData),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  getMyEvents: () => api.get('/events/my-events'),
};

// Bookings API calls
export const bookingsAPI = {
  getAllBookings: () => api.get('/bookings'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  updateBooking: (id, bookingData) => api.put(`/bookings/${id}`, bookingData),
  deleteBooking: (id) => api.delete(`/bookings/${id}`),
  getMyBookings: () => api.get('/bookings/my-bookings'),
};

// Users API calls
export const usersAPI = {
  getCurrentUser: () => api.get('/users/me'),
  updateUser: (userData) => api.put('/users/me', userData),
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
};

export default api; 