import axios from 'axios';

const BASE_URL = 'http://localhost:5001/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
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
  
  // Handle FormData
  if (config.data instanceof FormData) {
    config.headers['Content-Type'] = 'multipart/form-data';
  }
  
  // Log request details
  console.log('Request:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data instanceof FormData ? 'FormData' : config.data
  });
  
  return config;
});

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log('Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Log error details
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });

    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth-related API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
  forgotPassword: (email) => api.put('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  resendVerification: () => api.post('/auth/resend-verification')
};

// User management API endpoints
export const userAPI = {
  getAllUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
  updateUserRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
  updateUserStatus: (id, status) => api.patch(`/users/${id}/status`, { status }),
  getUserBookings: (id) => api.get(`/users/${id}/bookings`),
  getUserEvents: (id) => api.get(`/users/${id}/events`),
  searchUsers: (query) => api.get(`/users/search?q=${query}`)
};

// Event-related API endpoints
export const eventAPI = {
  getAllEvents: () => api.get('/events'),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => api.post('/events', eventData),
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  getMyEvents: () => api.get('/events/my-events'),
  updateEventStatus: (id, status) => api.patch(`/events/${id}/status`, { status }),
  getEventAnalytics: (id) => api.get(`/events/${id}/analytics`),
  getEventsByOrganizer: () => api.get('/events/organizer'),
  uploadEventImage: (eventId, imageData) => {
    return api.post(`/events/${eventId}/image`, imageData);
  },
  bookTickets: (eventId, data) => api.post(`/events/${eventId}/book`, data)
};

export default api; 