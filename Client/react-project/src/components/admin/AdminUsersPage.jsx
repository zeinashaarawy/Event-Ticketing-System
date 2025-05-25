import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../utils/axios';

import UserRow from './UserRow';
import UpdateUserRoleModal from './UpdateUserRoleModal';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // New state for modal control
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Please login to access this page');
        return navigate('/login');
      }

      if (!isAdmin) {
        toast.error('You do not have permission to access this page');
        return navigate('/');
      }

      const res = await api.getAllUsers();
      const data = res.data?.users || res.data?.data || res.data;

      if (!Array.isArray(data)) {
        throw new Error('Unexpected user data format');
      }

      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load users:', err);
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again');
        return navigate('/login');
      } else if (err.response?.status === 403) {
        toast.error('Access denied');
        return navigate('/');
      } else {
        setError('Failed to load users.');
        toast.error('Something went wrong while loading users.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [isAdmin, navigate]);

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await api.updateUser(userId, { role: newRole });
      toast.success('User role updated successfully');
      
      // Update the local state
      setUsers(prevUsers => 
        prevUsers.map(u => u._id === userId ? { ...u, role: newRole } : u)
      );
    } catch (err) {
      console.error('Failed to update role:', err);
      toast.error(err.response?.data?.message || 'Failed to update user role');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      // First check if user is trying to delete themselves
      if (userId === user._id) {
        toast.error('You cannot delete your own account');
        return;
      }

      // Show confirmation dialog
      if (!window.confirm('Are you sure you want to delete this user?')) {
        return;
      }

      // Attempt to delete the user
      await api.deleteUser(userId);

      // If successful, update the local state
      setUsers(prevUsers => prevUsers.filter(u => u._id !== userId));
      toast.success('User deleted successfully');
    } catch (err) {
      console.error('Failed to delete user:', err);
      
      // Handle specific error cases
      if (err.response?.status === 401) {
        toast.error('Session expired. Please login again');
        navigate('/login');
      } else if (err.response?.status === 403) {
        toast.error('You do not have permission to delete this user');
      } else if (err.response?.status === 404) {
        toast.error('User not found');
        // Remove from local state if the user doesn't exist anymore
        setUsers(prevUsers => prevUsers.filter(u => u._id !== userId));
      } else {
        toast.error(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  // Modal open/close handlers
  const openEditModal = (user) => setEditingUser(user);
  const closeEditModal = () => setEditingUser(null);

  const handleModalUpdate = async (newRole) => {
    if (!editingUser) return;
    await handleUpdateRole(editingUser._id, newRole);
    closeEditModal();
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-white text-lg">Loading users...</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h3 className="text-xl font-medium text-red-400 mb-4">Error Loading Users</h3>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Page content
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-semibold text-white">User Management</h1>
          <p className="mt-2 text-sm text-gray-300">
            Manage all users in the system including their roles and permissions.
          </p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-white mb-2">No Users Found</h3>
          <p className="text-gray-300">There are no users in the system yet.</p>
        </div>
      ) : (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">
                        Name
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                        Email
                      </th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                        Role
                      </th>
                      <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700 bg-gray-800">
                    {users.map((user) => (
                      <UserRow
                        key={user._id}
                        user={user}
                        onEdit={openEditModal}
                        onDelete={handleDeleteUser}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <UpdateUserRoleModal
        isOpen={!!editingUser}
        onClose={closeEditModal}
        currentRole={editingUser?.role}
        onUpdate={handleModalUpdate}
      />
    </div>
  );
};

export default AdminUsersPage;

