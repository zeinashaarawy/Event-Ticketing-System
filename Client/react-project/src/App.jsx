import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/authContext';
import { EventProvider } from './context/eventContext';
import Navbar from './components/shared/Navbar';
import Footer from './components/shared/Footer';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ForgotPassword from './components/auth/ForgotPassword';
import PrivateRoute from './components/auth/PrivateRoute';
import ProfilePage from './components/profile/ProfilePage';
import EventList from './components/events/EventList';
import EventDetails from './components/events/EventDetails';
import CreateEvent from './components/events/CreateEvent';
import MyEvents from './components/events/MyEvents';
import EventAnalytics from './components/events/EventAnalytics';
import AdminUsersPage from './components/admin/AdminUsersPage';
import { Link } from 'react-router-dom';
import { useAuth } from './context/authContext';
import EditEvent from './components/events/EditEvent';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 text-transparent bg-clip-text">
          Welcome to Evently
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Your premier platform for discovering and managing events. Create, explore, and experience unforgettable moments.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 px-4">
          <Link
            to="/events"
            className="w-full sm:w-auto px-8 py-3 text-base font-medium rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:opacity-90 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
          >
            Explore Events
          </Link>
          {isAuthenticated ? (
            <Link
              to="/profile"
              className="w-full sm:w-auto px-8 py-3 text-base font-medium rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-90 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
            >
              Profile
            </Link>
          ) : (
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3 text-base font-medium rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-90 transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
            >
              Get Started
            </Link>
          )}
          <Link
            to={isAuthenticated ? "/create-event" : "/login"}
            className="w-full sm:w-auto px-8 py-3 text-base font-medium rounded-lg border-2 border-indigo-500 text-white hover:bg-indigo-500/10 transition-all duration-200 transform hover:scale-105"
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
          <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/events" element={<EventList />} />
                <Route path="/events/:id" element={<EventDetails />} />
                
                {/* Event Management Routes */}
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
                  path="/events/:id/analytics"
                  element={
                    <PrivateRoute organizerOnly>
                      <EventAnalytics />
                    </PrivateRoute>
                  }
                />
                
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <ProfilePage />
                    </PrivateRoute>
                  }
                />
                
                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute adminOnly>
                      <Navigate to="/admin/users" replace />
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
            toastClassName="bg-gray-800 text-white"
            progressClassName="bg-indigo-500"
          />
        </EventProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
