import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Ticketing</h3>
            <p className="text-gray-600">
              Your one-stop platform for discovering and booking events.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-indigo-600">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-600 hover:text-indigo-600">
                  Events
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-indigo-600">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 hover:text-indigo-600">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-600">
              <li>Email: support@eventticketing.com</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Address: 123 Event Street, City, Country</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500">
            © {currentYear} Event Ticketing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 