import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ children, adminOnly = false, organizerOnly = false }) => {
  const { user, isAuthenticated, isAdmin, isOrganizer, loading } = useAuth();
  const location = useLocation();

  console.log('PrivateRoute:', {
    isAuthenticated,
    isAdmin,
    isOrganizer,
    adminOnly,
    organizerOnly,
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

  if (organizerOnly && !isOrganizer) {
    console.log('Access denied: User is not organizer');
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute; 
