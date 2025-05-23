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

// Event-related API endpoints
export const eventAPI = {
  getAllEvents: () => api.get('/events'),
  getEventById: (id) => api.get(`/events/${id}`),
  createEvent: (eventData) => {
    return api.post('/events', eventData);
  },
  updateEvent: (id, eventData) => api.put(`/events/${id}`, eventData),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  getMyEvents: () => api.get('/users/events'),
  getEventsByOrganizer: () => api.get('/events/organizer'),
  uploadEventImage: (eventId, imageData) => {
    return api.post(`/events/${eventId}/image`, imageData);
  }
};

export default api; 