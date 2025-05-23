import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../utils/axios';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, user is not authenticated');
        setUser(null);
        setLoading(false);
        return;
      }
      console.log('Token found, verifying user...');
      const response = await authAPI.getCurrentUser();
      console.log('Current user data:', response.data);
      setUser(response.data);
    } catch (error) {
      console.error('Auth check failed:', error);
      if (error.response?.status === 401) {
        console.log('Token is invalid or expired');
        setUser(null);
        localStorage.removeItem('token');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { user: userData, token } = response.data;
      
      console.log('Login successful:', { userData, hasToken: !!token });
      
      if (token) {
        localStorage.setItem('token', token);
      }
      
      setUser(userData);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed';
      toast.error(errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { token, user: newUser } = response.data;
      
      if (token) {
        localStorage.setItem('token', token);
      }
      
      setUser(newUser);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      toast.error(errorMessage);
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const forgotPassword = async (email) => {
    try {
      const response = await authAPI.forgotPassword(email);
      console.log('Forgot password response:', response);
      
      // The backend now sends an OTP in the response
      if (response.data?.message) {
        return { 
          success: true,
          message: response.data.message
        };
      } else {
        return {
          success: false,
          error: 'Failed to send OTP'
        };
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to process password reset request'
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      const errorMessage = error.response?.data?.message || 'Logout failed';
      toast.error(errorMessage);
      setUser(null);
      localStorage.removeItem('token');
      return { 
        success: false, 
        error: errorMessage
      };
    }
  };

  const updateProfile = async (userData) => {
    try {
      const response = await authAPI.updateProfile(userData);
      const updatedUser = response.data.user || response.data;
      
      setUser(prev => ({
        ...prev,
        ...updatedUser
      }));
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMessage = error.response?.data?.message || 'Profile update failed';
      toast.error(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    checkAuth,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isOrganizer: user?.role === 'organizer'
  };

  console.log('Auth context state:', {
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    userRole: user?.role,
    loading
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
