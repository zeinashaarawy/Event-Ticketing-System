import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Alert, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/axios';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.put('/forgetPassword', { email });
      setMessage({ 
        type: 'success', 
        text: 'OTP has been sent to your email' 
      });
      setPreviewUrl(response.data.previewUrl); // For testing purposes
      // Navigate to OTP verification page with email
      navigate('/reset-password', { state: { email } });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to send OTP' 
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
        Forgot Password
      </Typography>

      <Typography variant="body2" sx={{ mb: 3 }}>
        Enter your email address and we'll send you an OTP to reset your password.
      </Typography>

      <TextField
        fullWidth
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        margin="normal"
      />

      {message.text && (
        <Alert severity={message.type} sx={{ mt: 2 }}>
          {message.text}
        </Alert>
      )}

      {previewUrl && (
        <Alert severity="info" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Testing: View your OTP email at{' '}
            <Link href={previewUrl} target="_blank" rel="noopener">
              this link
            </Link>
          </Typography>
        </Alert>
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        sx={{ mt: 3 }}
        disabled={loading}
      >
        {loading ? 'Sending...' : 'Send OTP'}
      </Button>

      <Button
        fullWidth
        variant="text"
        onClick={() => navigate('/login')}
        sx={{ mt: 1 }}
      >
        Back to Login
      </Button>
    </Box>
  );
};

export default ForgotPasswordForm; 