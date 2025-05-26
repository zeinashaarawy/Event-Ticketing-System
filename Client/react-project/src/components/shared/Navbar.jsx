import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      navigate('/login');
    }
  };

  const navLinkClass = ({ isActive }) =>
    `relative px-4 py-2 text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'text-white'
        : 'text-gray-300 hover:text-white'
    } group`;

  const activeIndicator =
    'after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:bg-gradient-to-r from-pink-500 via-fuchsia-500 to-sky-500 after:rounded-full after:transition-all after:duration-300';

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/70 backdrop-blur-md shadow-lg'
          : 'bg-gradient-to-tr from-gray-900/60 via-gray-800/50 to-gray-900/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-extrabold bg-gradient-to-r from-fuchsia-400 via-indigo-500 to-cyan-400 text-transparent bg-clip-text tracking-tight hover:opacity-90 transition-opacity duration-300"
          >
            Evently
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {['/', '/events'].map((path, i) => {
              const labels = ['Home', 'Events'];
              return (
                <NavLink key={path} to={path} className={navLinkClass}>
                  {({ isActive }) => (
                    <span
                      className={`${
                        isActive
                          ? activeIndicator
                          : 'group-hover:after:absolute group-hover:after:bottom-0 group-hover:after:left-0 group-hover:after:h-[2px] group-hover:after:w-full group-hover:after:bg-fuchsia-500 group-hover:after:transition-all group-hover:after:duration-300'
                      }`}
                    >
                      {labels[i]}
                    </span>
                  )}
                </NavLink>
              );
            })}

            {user?.role === 'organizer' && (
              <NavLink to="/my-events" className={navLinkClass}>
                {({ isActive }) => (
                  <span className={isActive ? activeIndicator : ''}>My Events</span>
                )}
              </NavLink>
            )}

            {user?.role === 'admin' && (
              <NavLink to="/admin" className={navLinkClass}>
                {({ isActive }) => (
                  <span className={isActive ? activeIndicator : ''}>Admin</span>
                )}
              </NavLink>
            )}

            {user?.role === 'organizer' && (
              <NavLink to="/create-event" className={navLinkClass}>
                {({ isActive }) => (
                  <span className={isActive ? activeIndicator : ''}>Create Event</span>
                )}
              </NavLink>
            )}
          </div>

          {/* Auth (Desktop) */}
          <div className="hidden md:flex items-center space-x-6">
            {user ? (
              <>
                <span className="text-sm text-gray-300">
                  Hi, <span className="font-semibold text-white">{user.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-pink-500 to-indigo-600 text-white hover:opacity-90 transition hover:shadow-lg"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-medium rounded-lg bg-white/10 text-fuchsia-400 hover:bg-white/20 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-fuchsia-500 to-sky-500 text-white hover:opacity-90 transition hover:shadow-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/80 backdrop-blur-xl border-t border-gray-800">
          <div className="px-6 py-4 space-y-3">
            {['/', '/events'].map((path, i) => {
              const labels = ['Home', 'Events'];
              return (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    } transition`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {labels[i]}
                </NavLink>
              );
            })}

            {user?.role === 'organizer' && (
              <NavLink
                to="/my-events"
                className={({ isActive }) =>
                  `block px-4 py-2.5 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  } transition`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Events
              </NavLink>
            )}

            {user?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `block px-4 py-2.5 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  } transition`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </NavLink>
            )}

            {user?.role === 'organizer' && (
              <NavLink
                to="/create-event"
                className={({ isActive }) =>
                  `block px-4 py-2.5 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  } transition`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Create Event
              </NavLink>
            )}

            <div className="border-t border-gray-800 pt-4 mt-4">
              {user ? (
                <>
                  <p className="text-sm text-gray-300 mb-3">
                    Hi, <span className="font-medium text-white">{user.name}</span>
                  </p>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm rounded-lg bg-white/10 text-gray-200 hover:bg-white/20 transition"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="block px-4 py-2.5 text-sm rounded-lg text-fuchsia-400 bg-white/10 hover:bg-white/20 transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2.5 text-sm rounded-lg bg-gradient-to-r from-fuchsia-500 to-sky-500 text-white hover:opacity-90 transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
