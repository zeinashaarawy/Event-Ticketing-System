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
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getAllUsers();
      console.log('Users response:', response);
      
      // Handle different response formats
      const userData = response.data?.users || response.data || [];
      setUsers(userData);
      setError(null);
    } catch (err) {
      console.error('Failed to load users:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load users';
      setError(errorMessage);
      toast.error(errorMessage);
      
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await userAPI.updateUserRole(userId, newRole);
      toast.success('User role updated successfully');
      
      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(u => u._id === userId ? { ...u, role: newRole } : u)
      );
    } catch (err) {
      console.error('Failed to update role:', err);
      const errorMessage = err.response?.data?.message || 'Failed to update user role';
      toast.error(errorMessage);
      
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      if (userId === user._id) {
        toast.error('You cannot delete your own account');
        return;
      }

      if (!window.confirm('Are you sure you want to delete this user?')) {
        return;
      }

      await userAPI.deleteUser(userId);
      setUsers(prevUsers => prevUsers.filter(u => u._id !== userId));
      toast.success('User deleted successfully');
    } catch (err) {
      console.error('Failed to delete user:', err);
      const errorMessage = err.response?.data?.message || 'Failed to delete user';
      toast.error(errorMessage);
      
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.role?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mb-4"></div>
        <p className="text-white text-lg">Loading users...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div className="sm:flex-auto">
          <h1 className="text-3xl font-semibold text-white">User Management</h1>
          <p className="mt-2 text-sm text-gray-300">
            Manage all users in the system including their roles and permissions.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {error ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-red-400 mb-2">Error</h3>
          <p className="text-gray-300">{error}</p>
          <button
            onClick={fetchUsers}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-white mb-2">
            {searchQuery ? 'No matching users found' : 'No users found'}
          </h3>
          <p className="text-gray-300">
            {searchQuery ? 'Try adjusting your search criteria' : 'There are no users in the system yet.'}
          </p>
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
                    {filteredUsers.map((user) => (
                      <UserRow
                        key={user._id}
                        user={user}
                        onEdit={() => setEditingUser(user)}
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

      {editingUser && (
        <UpdateUserRoleModal
          isOpen={!!editingUser}
          onClose={() => setEditingUser(null)}
          onUpdate={(newRole) => handleUpdateRole(editingUser._id, newRole)}
          currentRole={editingUser.role}
        />
      )}
    </div>
  );
};

export default AdminUsersPage;

