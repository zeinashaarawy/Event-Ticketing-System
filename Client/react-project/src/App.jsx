import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EventProvider } from './context/eventContext';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPasswordForm from './components/auth/ResetPasswordForm';
import ProtectedRoute from './components/shared/ProtectedRoute';
import Unauthorized from './components/Unauthorized';
import PrivateRoute from './components/auth/PrivateRoute';
import ProfilePage from './components/profile/ProfilePage';
import EventList from './components/events/EventList';
import EventDetails from './components/events/EventDetails';
import CreateEvent from './components/events/CreateEvent';
import MyEvents from './components/events/MyEvents';
import EventAnalytics from './pages/EventAnalytics';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminUsersPage from './components/admin/AdminUsersPage';
import AdminEventsPage from './components/admin/AdminEventsPage';
import EditEvent from './components/events/EditEvent';
import UserBookingsPage from './pages/UserBookingsPage';
import BookingDetails from './pages/BookingDetails';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      <div className="text-center space-y-8 px-4">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          Welcome to Evently
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Your premier platform for discovering and managing events. Create, explore, and experience unforgettable moments.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <Link
            to="/events"
            className="w-full sm:w-auto px-8 py-3 text-base font-medium rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
          >
            Explore Events
          </Link>
          {isAuthenticated ? (
            <Link
              to="/profile"
              className="w-full sm:w-auto px-8 py-3 text-base font-medium rounded-lg bg-gradient-to-r from-pink-500 to-red-500 text-white hover:opacity-90 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
            >
              Profile
            </Link>
          ) : (
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3 text-base font-medium rounded-lg bg-gradient-to-r from-pink-500 to-red-500 text-white hover:opacity-90 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
            >
              Get Started
            </Link>
          )}
          <Link
            to={isAuthenticated ? "/create-event" : "/login"}
            className="w-full sm:w-auto px-8 py-3 text-base font-medium rounded-lg border-2 border-purple-500 text-white hover:bg-purple-500/10 transition-all duration-200 transform hover:scale-105"
          >
            {isAuthenticated ? "Create Event" : "Sign In"}
          </Link>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <EventProvider>
          <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black">
            <Navbar />
            <main className="min-h-[calc(100vh-64px)]">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPasswordForm />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/events" element={<EventList />} />
                <Route path="/events/:id" element={<EventDetails />} />
                
                {/* Protected Routes - Standard Users */}
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/my-bookings"
                  element={
                    <PrivateRoute>
                      <UserBookingsPage />
                    </PrivateRoute>
                  }
                />
                
                {/* Protected Routes - Organizers */}
                <Route
                  path="/create-event"
                  element={
                    <PrivateRoute organizerOnly>
                      <CreateEvent />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/my-events"
                  element={
                    <PrivateRoute organizerOnly>
                      <MyEvents />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/events/:id/edit"
                  element={
                    <PrivateRoute organizerOnly>
                      <EditEvent />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <PrivateRoute organizerOnly>
                      <EventAnalytics />
                    </PrivateRoute>
                  }
                />
                
                {/* Protected Routes - Admin Only */}
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute adminOnly>
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <PrivateRoute adminOnly>
                      <AdminUsersPage />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/admin/events"
                  element={
                    <PrivateRoute adminOnly>
                      <AdminEventsPage />
                    </PrivateRoute>
                  }
                />
                
                {/* Protected Routes - Booking Details */}
                <Route
                  path="/bookings/:id"
                  element={
                    <PrivateRoute>
                      <BookingDetails />
                    </PrivateRoute>
                  }
                />
                
                {/* Catch all route for 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <ToastContainer 
            position="top-right" 
            autoClose={3000}
            theme="dark"
            toastClassName="bg-gray-800/90 backdrop-blur-sm border border-gray-700/50 text-white"
            progressClassName="bg-gradient-to-r from-purple-500 to-pink-500"
          />
        </EventProvider>
      </AuthProvider>
    </Router>
  );
}

export default App; 