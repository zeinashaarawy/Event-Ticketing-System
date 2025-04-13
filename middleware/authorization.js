const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden, you don’t have permission to perform this action' });
    }
    next(); // User has the required role, continue
  };
};

module.exports = { authorize };
