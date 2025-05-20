import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/10 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 to-indigo-500 text-transparent bg-clip-text tracking-tight">
              Event Ticketing
            </Link>
          </div>

          {/* Nav Links */}
          <div className="hidden sm:flex sm:space-x-6 items-center text-sm font-medium">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition duration-200"
            >
              Home
            </Link>
            <Link
              to="/events"
              className="text-gray-300 hover:text-white transition duration-200"
            >
              Events
            </Link>

            {user?.role === 'organizer' && (
              <Link
                to="/my-events"
                className="text-gray-300 hover:text-white transition duration-200"
              >
                My Events
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="text-gray-300 hover:text-white transition duration-200"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-gray-200 hidden sm:inline">Welcome, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium rounded-md bg-white text-indigo-600 hover:bg-gray-100 transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
