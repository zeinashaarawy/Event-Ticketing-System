import { useState, useEffect, useCallback, useRef } from 'react';
import { useEvents } from '../../context/eventContext';
import { eventAPI } from '../../utils/axios';
import { Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../../context/authContext';

const EventList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);
  const [filters, setFilters] = useState({
    location: '',
    date: '',
    category: '',
    status: 'all'
  });
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all events initially
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await eventAPI.getAllEvents();
      
      // Get events from response
      const eventsList = response.data?.events || [];
      
      // If user is not admin or organizer, only show approved events
      const visibleEvents = user?.role === 'admin' || user?.role === 'organizer'
        ? eventsList
        : eventsList.filter(event => event.status === 'approved');

      setEvents(visibleEvents);
      setFilteredEvents(visibleEvents);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Filter events based on search criteria
  const filterEvents = useCallback(() => {
    let filtered = [...events];

    // Apply search term to title, description, and category
    const term = searchTerm.trim().toLowerCase();
    if (term) {
      filtered = filtered.filter(event => 
        event.title?.toLowerCase().includes(term) ||
        event.description?.toLowerCase().includes(term) ||
        event.category?.toLowerCase().includes(term) ||
        event.location?.toLowerCase().includes(term)
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(event => event.category === filters.category);
    }

    // Apply location filter
    if (filters.location) {
      const location = filters.location.trim().toLowerCase();
      filtered = filtered.filter(event => 
        event.location?.toLowerCase().includes(location)
      );
    }

    // Apply date filter
    if (filters.date) {
      const targetDate = new Date(filters.date).toISOString().split('T')[0];
      filtered = filtered.filter(event => {
        const eventDate = new Date(event.date).toISOString().split('T')[0];
        return eventDate === targetDate;
      });
    }

    // Apply status filter (only for admin/organizer)
    if (filters.status !== 'all' && (user?.role === 'admin' || user?.role === 'organizer')) {
      filtered = filtered.filter(event => event.status === filters.status);
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, filters, user]);

  // Update filtered events whenever search term or filters change
  useEffect(() => {
    filterEvents();
  }, [filterEvents]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search result selection
  const handleSearchResultClick = (eventId) => {
    setShowSearchResults(false);
    setSearchTerm('');
    navigate(`/events/${eventId}`);
  };

  // Get search results
  const getSearchResults = () => {
    if (!searchTerm.trim()) return [];
    
    return filteredEvents
      .filter(event => 
        event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5); // Limit to 5 results
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50',
      approved: 'bg-green-500/20 text-green-500 border-green-500/50',
      declined: 'bg-red-500/20 text-red-500 border-red-500/50'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Search and Filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative" ref={searchRef}>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSearchResults(true);
              }}
              className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchTerm.trim() && (
              <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
                {getSearchResults().length > 0 ? (
                  getSearchResults().map(event => (
                    <button
                      key={event._id}
                      onClick={() => handleSearchResultClick(event._id)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-700/50 flex flex-col border-b border-gray-700 last:border-b-0"
                    >
                      <span className="text-white font-medium">{event.title}</span>
                      <span className="text-sm text-gray-400">
                        {format(new Date(event.date), 'MMM dd, yyyy')} • {event.location}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-400">
                    No events found matching "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="md:w-48">
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              <option value="conference">Conference</option>
              <option value="workshop">Workshop</option>
              <option value="concert">Concert</option>
              <option value="sports">Sports</option>
              <option value="exhibition">Exhibition</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="md:w-64">
            <input
              type="text"
              placeholder="Filter by location"
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div className="md:w-48">
            <input
              type="date"
              value={filters.date}
              onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {(user?.role === 'admin' || user?.role === 'organizer') && (
            <div className="md:w-48">
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="declined">Declined</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Results */}
      {!loading && !error && (
        <>
          {/* Search Results Summary */}
          <div className="mb-6 text-gray-400">
            {searchTerm || filters.location || filters.date || filters.category || filters.status !== 'all' ? (
              <p>
                Found {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
                {searchTerm ? ` matching "${searchTerm}"` : ''}
                {filters.category ? ` in ${filters.category}` : ''}
                {filters.location ? ` in ${filters.location}` : ''}
                {filters.date ? ` on ${new Date(filters.date).toLocaleDateString()}` : ''}
                {filters.status !== 'all' ? ` with status "${filters.status}"` : ''}
              </p>
            ) : (
              <p>Showing all {filteredEvents.length} available events</p>
            )}
          </div>

          {/* No Results Message */}
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 bg-gray-800/50 rounded-lg">
              <h3 className="text-xl text-gray-300">No Events Found</h3>
              <p className="text-gray-400 mt-2">
                Try adjusting your search criteria
              </p>
            </div>
          ) : (
            /* Event Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map(event => (
                <Link
                  key={event._id}
                  to={`/events/${event._id}`}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 border border-gray-700/50 hover:border-indigo-500/50"
                >
                  <div className="aspect-w-16 aspect-h-9 relative">
                    <img
                      src={event.imageUrl || 'https://via.placeholder.com/400x225'}
                      alt={event.title}
                      className="object-cover w-full h-full"
                    />
                    {(user?.role === 'admin' || user?.role === 'organizer') && (
                      <div className="absolute top-2 right-2">
                        {getStatusBadge(event.status)}
                      </div>
                    )}
                  </div>
                  
                  <div className="p-5">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {event.title}
                    </h3>
                    
                    <div className="space-y-2 text-gray-300 text-sm">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {format(new Date(event.date), 'MMM dd, yyyy - h:mm a')}
                      </div>
                      
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          ${event.ticketPrice?.toFixed(2)}
                        </div>
                        {event.ticketsAvailable > 0 && (
                          <div className="text-xs text-gray-400">
                            {event.ticketsAvailable} tickets available
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="mt-3 text-gray-400 text-sm line-clamp-2">
                      {event.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EventList;

