import { useState, useEffect } from 'react';
import UpdateProfileForm from './UpdateProfileForm';
import { toast } from 'react-toastify';
import api from '../../utils/axios';
import {useAuth} from '../../context/authContext';

const ProfilePage = () => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      setUser(authUser);
      setLoading(false);
    } else {
      fetchUserProfile();
    }
  }, [authUser]);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      setUser(response.data);
    } catch (error) {
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      const response = await api.put('/users/profile', updatedData);
      setUser(response.data);
      toast.success('Profile updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>
          
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Your Information</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="mt-1 text-sm text-gray-900">{user?.name || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="mt-1 text-sm text-gray-900">{user?.email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Role</p>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{user?.role || 'User'}</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Update Profile</h2>
            <UpdateProfileForm user={user} onUpdate={handleUpdateProfile} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 
