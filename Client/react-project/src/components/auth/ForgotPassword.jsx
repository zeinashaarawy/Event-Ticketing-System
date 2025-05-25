import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { authAPI } from '../../utils/axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('email'); // email, otp, or reset
  const [generatedOtp, setGeneratedOtp] = useState(''); // Store the OTP from response
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      console.log('Sending forgot password request for email:', email);
      const result = await forgotPassword(email);
      console.log('Forgot password result:', result);
      
      if (result.success || result.message) {
        // Extract OTP from message (format: "OTP generated: 123456 ")
        const otpMatch = result.message.match(/OTP generated: (\S+)/);
        console.log('OTP match:', otpMatch);
        
        if (otpMatch && otpMatch[1]) {
          const extractedOtp = otpMatch[1].trim();
          console.log('Extracted OTP:', extractedOtp);
          setGeneratedOtp(extractedOtp);
          setOtp(extractedOtp);
          setStep('otp');
          toast.success('OTP has been generated');
        } else {
          console.error('Failed to extract OTP from message:', result.message);
          toast.error('Failed to generate OTP. Please try again.');
        }
      } else {
        toast.error(result.error || 'Failed to generate OTP. Please try again.');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(
        error.response?.data?.message || 
        error.message || 
        'An error occurred while processing your request. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.resetPassword(email, {
        otp,
        newPassword
      });

      if (response.data?.message) {
        toast.success('Password reset successful!');
        navigate('/login');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(
        error.response?.data?.message || 
        'Failed to reset password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (step === 'otp') {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-700">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 text-transparent bg-clip-text">
              Reset your password
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Enter the OTP and your new password
            </p>
          </div>
          <div className="bg-indigo-900/50 p-6 rounded-lg border border-indigo-500/50">
            <p className="text-center text-gray-200">
              Your OTP Code:
            </p>
            <p className="text-center font-mono text-2xl font-bold text-indigo-400 mt-2">
              {generatedOtp || 'Loading...'}
            </p>
            <p className="text-xs text-center text-gray-400 mt-2">
              This code has been automatically filled in the form below
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleResetSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-300">
                  OTP Code
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  className="mt-1 block w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter OTP code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">
                  New Password
                </label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  className="mt-1 block w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="mt-1 block w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Resetting Password...
                  </div>
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-xl border border-gray-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-500 text-transparent bg-clip-text">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Enter your email address and we'll send you an OTP to reset your password
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending OTP...
                </div>
              ) : (
                'Send OTP'
              )}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Remember your password?{' '}
              <Link
                to="/login"
                className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword; 
