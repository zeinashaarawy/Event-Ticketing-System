import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/authContext';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  console.log('PrivateRoute:', {
    isAuthenticated,
    isAdmin,
    adminOnly,
    currentPath: location.pathname,
    user
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the attempted path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    console.log('Access denied: User is not admin');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute; 
