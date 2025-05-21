// src/api.js
import axios from "axios";

// API instance configuration
const api = axios.create({
  baseURL: "http://localhost:5001/api/v1",
  withCredentials: false
});

// Add a request interceptor to include the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Mock data for testing analytics
const mockAnalyticsData = {
  labels: [
    "2024-05-15", "2024-05-16", "2024-05-17", "2024-05-18", 
    "2024-05-19", "2024-05-20", "2024-05-21"
  ],
  ticketsSold: [5, 8, 15, 12, 20, 25, 18],
  revenue: [250, 400, 750, 600, 1000, 1250, 900],
  upcomingEvents: [
    {
      title: "Summer Music Festival",
      date: "2024-06-15",
      ticketsAvailable: 100,
      ticketPrice: 50
    },
    {
      title: "Tech Conference 2024",
      date: "2024-06-20",
      ticketsAvailable: 75,
      ticketPrice: 75
    }
  ],
  summary: {
    totalEvents: 5,
    totalTicketsSold: 103,
    totalRevenue: 5150
  }
};

// Modified endpoints for testing
export const getEventAnalytics = () => {
  // Return mock data for testing
  return Promise.resolve({ data: mockAnalyticsData });
};

export const getMyEvents = () => api.get("/events/my-events");

// --------------------- EVENTS (Organizer) ---------------------
export const getApprovedEvents = () => api.get("/events");
export const getAllEvents = () => api.get("/events/all"); // Admin only
export const createEvent = (data) => api.post("/events", data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);

// --------------------- AUTH ---------------------
export const login = (data) => api.post("/auth/login", data);
export const register = (data) => api.post("/auth/register", data);
export const logout = () => api.get("/auth/logout");
export const forgetPassword = (data) => api.put("/auth/forgetPassword", data);

// --------------------- PROFILE ---------------------
export const getProfile = () => api.get("/users/profile");
export const updateProfile = (data) => api.put("/users/profile", data);

// --------------------- BOOKINGS ---------------------
export const bookTickets = (data) => api.post("/bookings", data);
export const getUserBookings = () => api.get("/users/bookings");
export const getBookingDetails = (id) => api.get(`/bookings/${id}`);
export const cancelBooking = (id) => api.delete(`/bookings/${id}`);

// --------------------- USERS (Admin) ---------------------
export const getAllUsers = () => api.get("/users");
export const getUserById = (id) => api.get(`/users/${id}`);
export const updateUserRole = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);

// Enhanced analytics endpoints
export const getEventSpecificAnalytics = (eventId) => api.get(`/api/events/${eventId}/analytics`);

// Analytics data processing functions
export const processAnalyticsData = (data) => {
  const processed = {
    ...data,
    dailyStats: data.labels.map((date, index) => ({
      date,
      revenue: data.revenue[index] || 0,
      ticketsSold: data.ticketsSold[index] || 0,
    })),
    trends: calculateTrends(data),
    projections: calculateProjections(data),
  };
  return processed;
};

const calculateTrends = (data) => {
  if (!data.revenue || data.revenue.length < 2) return null;

  const revenueGrowth = calculateGrowthRate(data.revenue);
  const ticketsGrowth = calculateGrowthRate(data.ticketsSold);

  return {
    revenueGrowth,
    ticketsGrowth,
    isProfitable: revenueGrowth > 0,
    isGrowing: ticketsGrowth > 0,
  };
};

const calculateGrowthRate = (data) => {
  if (!data || data.length < 2) return 0;
  const oldValue = data[0];
  const newValue = data[data.length - 1];
  return oldValue === 0 ? 0 : ((newValue - oldValue) / oldValue) * 100;
};

const calculateProjections = (data) => {
  if (!data.revenue || data.revenue.length < 2) return null;

  const avgRevenue = data.revenue.reduce((a, b) => a + b, 0) / data.revenue.length;
  const avgTickets = data.ticketsSold.reduce((a, b) => a + b, 0) / data.ticketsSold.length;

  return {
    nextMonthRevenue: avgRevenue * 1.1, // Simple projection with 10% growth
    nextMonthTickets: avgTickets * 1.1,
    confidence: calculateConfidence(data),
  };
};

const calculateConfidence = (data) => {
  // Simple confidence calculation based on data consistency
  const revenueVariance = calculateVariance(data.revenue);
  const ticketsVariance = calculateVariance(data.ticketsSold);
  
  // Lower variance means higher confidence
  const maxVariance = Math.max(revenueVariance, ticketsVariance);
  return Math.max(0, Math.min(100, 100 - (maxVariance * 10)));
};

const calculateVariance = (numbers) => {
  if (!numbers || numbers.length === 0) return 0;
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const squareDiffs = numbers.map(value => Math.pow(value - mean, 2));
  return Math.sqrt(squareDiffs.reduce((a, b) => a + b, 0) / numbers.length);
};

// Export additional utility functions
export const analyticsUtils = {
  calculateGrowthRate,
  calculateProjections,
  calculateTrends,
  processAnalyticsData,
};

export default api;
