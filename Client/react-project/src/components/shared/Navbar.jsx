import { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Events', href: '/events' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

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
    <Disclosure as="nav" className="bg-white/10 backdrop-blur-md border-b border-white/10 shadow-md sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-indigo-500 text-transparent bg-clip-text tracking-tight">
                    Event Ticketing
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-white transition duration-200"
                    >
                      {item.name}
                    </Link>
                  ))}
                  {user?.role === 'organizer' && (
                    <Link
                      to="/my-events"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-white transition duration-200"
                    >
                      My Events
                    </Link>
                  )}
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-300 hover:text-white transition duration-200"
                    >
                      Admin
                    </Link>
                  )}
                </div>
              </div>

              <div className="hidden sm:flex sm:items-center sm:space-x-4">
                {user ? (
                  <Menu as="div" className="relative">
                    <Menu.Button className="flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <span className="text-gray-200">Welcome, {user.name}</span>
                      <UserCircleIcon className="h-8 w-8 text-gray-300 hover:text-white transition duration-200" />
                    </Menu.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white/90 backdrop-blur-sm ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to="/profile"
                              className={`${
                                active ? 'bg-gray-50' : ''
                              } block px-4 py-2 text-sm text-gray-700`}
                            >
                              Your Profile
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`${
                                active ? 'bg-gray-50' : ''
                              } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
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
                      className="px-4 py-2 text-sm font-medium rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition duration-200"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>

              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={Link}
                  to={item.href}
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/10"
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              {user?.role === 'organizer' && (
                <Disclosure.Button
                  as={Link}
                  to="/my-events"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/10"
                >
                  My Events
                </Disclosure.Button>
              )}
              {user?.role === 'admin' && (
                <Disclosure.Button
                  as={Link}
                  to="/admin"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/10"
                >
                  Admin
                </Disclosure.Button>
              )}
            </div>
            {user ? (
              <div className="pt-4 pb-3 border-t border-white/10">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <UserCircleIcon className="h-10 w-10 text-gray-300" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">
                      {user.name}
                    </div>
                    <div className="text-sm font-medium text-gray-300">
                      {user.email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Disclosure.Button
                    as={Link}
                    to="/profile"
                    className="block px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/10"
                  >
                    Your Profile
                  </Disclosure.Button>
                  <Disclosure.Button
                    as="button"
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-white/10"
                  >
                    Sign out
                  </Disclosure.Button>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-white/10">
                <div className="flex items-center px-4 space-x-4">
                  <Link
                    to="/login"
                    className="w-full px-4 py-2 text-sm font-medium text-center rounded-md bg-white text-indigo-600 hover:bg-gray-100 transition duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="w-full px-4 py-2 text-sm font-medium text-center rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition duration-200"
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar; 