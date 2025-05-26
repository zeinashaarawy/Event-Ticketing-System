import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5001/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // If the response includes a new token, update it in localStorage
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshResponse = await api.post('/auth/refresh-token');
        const newToken = refreshResponse.data.token;
        
        if (newToken) {
          localStorage.setItem('token', newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Only clear token and redirect if refresh token is invalid
        if (refreshError.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => {
    localStorage.removeItem('token');
    return api.post('/auth/logout');
  },
  forgotPassword: (email) => api.put('/auth/forgetPassword', { email }),
  resetPassword: (email, data) => api.put('/auth/verifyOtpAndResetPassword', {
    email,
    otp: data.otp,
    newPassword: data.newPassword
  }),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  refreshToken: () => api.post('/auth/refresh-token'),
};

// User API endpoints
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData) => api.put('/users/profile', userData),
  changePassword: (passwords) => api.put('/users/change-password', passwords),
  uploadAvatar: (formData) => api.post('/users/avatar', formData),
  deleteAccount: () => api.delete('/users/profile'),
  // Admin only endpoints
  getAllUsers: () => api.get('/users'),
  getUserById: (userId) => api.get(`/users/${userId}`),
  updateUser: (userId, userData) => api.put(`/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/users/${userId}`),
};

// Event API endpoints
export const eventAPI = {
  getAllEvents: () => api.get('/events/all'),
  getEventById: (eventId) => api.get(`/events/${eventId}`),
  createEvent: (eventData) => api.post('/events', eventData),
  updateEvent: (eventId, eventData) => api.put(`/events/${eventId}`, eventData),
  deleteEvent: (eventId) => api.delete(`/events/${eventId}`),
  uploadEventImage: (eventId, formData) => api.post(`/events/${eventId}/image`, formData),
  // Additional event endpoints
  getEventsByOrganizer: () => api.get('/users/events'),
  getUpcomingEvents: () => api.get('/events/upcoming'),
  getPastEvents: () => api.get('/events/past'),
  searchEvents: (query) => api.get(`/events/search?q=${query}`),
  getEventsByCategory: (category) => api.get(`/events/category/${category}`),
  getEventsByLocation: (location) => api.get(`/events/location/${location}`),
  getEventAnalytics: () => api.get('/users/events/analytics'),
  // Admin endpoints
  approveEvent: (eventId) => api.put(`/events/${eventId}`, { status: 'approved' }),
  rejectEvent: (eventId) => api.put(`/events/${eventId}`, { status: 'declined' }),
  getAllEventsAdmin: () => api.get('/events/all')
};

// Booking API endpoints
export const bookingAPI = {
  bookTickets: (eventId, bookingData) => api.post('/bookings', { eventId, ...bookingData }),
  getUserBookings: () => api.get('/users/bookings'),
  getBookingById: (bookingId) => api.get(`/bookings/${bookingId}`),
  cancelBooking: (bookingId) => api.delete(`/bookings/${bookingId}`),
  // Admin endpoints
  getAllBookings: () => api.get('/admin/bookings'),
  getBookingsByEvent: (eventId) => api.get(`/admin/bookings/event/${eventId}`),
  getBookingsByUser: (userId) => api.get(`/admin/bookings/user/${userId}`)
};

// Category API endpoints
export const categoryAPI = {
  getAllCategories: () => api.get('/categories'),
  getCategoryById: (categoryId) => api.get(`/categories/${categoryId}`),
  createCategory: (categoryData) => api.post('/categories', categoryData),
  updateCategory: (categoryId, categoryData) => api.put(`/categories/${categoryId}`, categoryData),
  deleteCategory: (categoryId) => api.delete(`/categories/${categoryId}`),
};

// Review API endpoints
export const reviewAPI = {
  getEventReviews: (eventId) => api.get(`/events/${eventId}/reviews`),
  createReview: (eventId, reviewData) => api.post(`/events/${eventId}/reviews`, reviewData),
  updateReview: (reviewId, reviewData) => api.put(`/reviews/${reviewId}`, reviewData),
  deleteReview: (reviewId) => api.delete(`/reviews/${reviewId}`),
  // Admin endpoints
  getAllReviews: () => api.get('/admin/reviews'),
  approveReview: (reviewId) => api.put(`/reviews/${reviewId}/approve`),
  rejectReview: (reviewId) => api.put(`/reviews/${reviewId}/reject`)
};

// Payment API endpoints
export const paymentAPI = {
  createPaymentIntent: (bookingId) => api.post(`/payments/create-intent/${bookingId}`),
  confirmPayment: (bookingId, paymentData) => api.post(`/payments/confirm/${bookingId}`, paymentData),
  getPaymentHistory: () => api.get('/payments/history'),
};

export default api;