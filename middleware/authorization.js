// Middleware to authorize users based on their roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: You don’t have permission to perform this action' });
    }
    next(); // Proceed to the next middleware or route handler
  };
};

module.exports = { authorize };
