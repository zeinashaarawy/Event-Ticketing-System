import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Toast from '../shared/Toast';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

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

    try {
      await login(formData.email, formData.password);
      setShowToast(true);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="card w-full max-w-md transform hover:scale-[1.01] transition-all duration-300">
        <div className="card-header text-center">
          <h2 className="text-4xl font-extrabold gradient-text">
            Welcome back
          </h2>
          <p className="mt-3 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
        </div>

        <div className="card-body">
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input"
                placeholder="Enter your password"
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50/80 backdrop-blur-sm p-4 rounded-lg border border-red-100">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-purple-600 hover:text-purple-500 transition-colors duration-200"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button type="submit" className="btn-primary w-full">
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>

      {showToast && (
        <Toast
          message="Successfully logged in!"
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default LoginForm; 