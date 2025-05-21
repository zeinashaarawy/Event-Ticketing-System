import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../utils/axios';

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [formData, setFormData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  // Redirect to forgot password if no email
  if (!email) {
    navigate('/forgotPassword');
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      await api.put('/verifyOtpAndResetPassword', {
        email,
        otp: formData.otp,
        newPassword: formData.newPassword
      });

      setMessage({ 
        type: 'success', 
        text: 'Password reset successful! You can now login with your new password.' 
      });

      // Navigate to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to reset password' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 4,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Reset Password
      </Typography>

      <Typography variant="body2" sx={{ mb: 3 }}>
        Enter the OTP sent to your email and your new password.
      </Typography>

      <TextField
        fullWidth
        label="OTP"
        name="otp"
        value={formData.otp}
        onChange={handleChange}
        required
        margin="normal"
      />

      <TextField
        fullWidth
        label="New Password"
        name="newPassword"
        type="password"
        value={formData.newPassword}
        onChange={handleChange}
        required
        margin="normal"
      />

      <TextField
        fullWidth
        label="Confirm New Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
        margin="normal"
      />

      {message.text && (
        <Alert severity={message.type} sx={{ mt: 2 }}>
          {message.text}
        </Alert>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3 }}
        disabled={loading}
      >
        {loading ? 'Resetting...' : 'Reset Password'}
      </Button>

      <Button
        fullWidth
        variant="text"
        onClick={() => navigate('/forgot-password')}
        sx={{ mt: 1 }}
      >
        Request New OTP
      </Button>
    </Box>
  );
};

export default ResetPasswordForm; 