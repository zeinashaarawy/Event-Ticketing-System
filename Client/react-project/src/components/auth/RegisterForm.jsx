import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Toast from '../shared/Toast';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password, formData.role);
      setShowToast(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="card w-full max-w-md transform hover:scale-[1.01] transition-all duration-300">
        <div className="card-header text-center">
          <h2 className="text-4xl font-extrabold gradient-text">
            Create your account
          </h2>
          <p className="mt-3 text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="card-body">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="input"
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input"
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="Create a password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input"
                placeholder="Confirm your password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="role" className="form-label">
                Account Type
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input"
              >
                <option value="user">Event Attendee</option>
                <option value="organizer">Event Organizer</option>
              </select>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50/80 backdrop-blur-sm p-4 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <div>
              <button type="submit" className="btn-primary w-full">
                Create Account
              </button>
            </div>
          </form>
        </div>
      </div>

      {showToast && (
        <Toast
          message="Registration successful! Redirecting to login..."
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default RegisterForm; 