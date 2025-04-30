// Role-based authorization middleware
module.exports = (roles) => {
  return (req, res, next) => {
    // Check if user exists and has a role
    if (!req.user || !req.user.role) {
      return res
        .status(403)
        .json({ message: "Access denied. No role assigned." });
    }

    // Check if user's role is in the allowed roles array
    if (roles.includes(req.user.role)) {
      next();
    } else {
      return res.status(403).json({
        message:
          "Access denied. You don't have permission to access this resource.",
        requiredRoles: roles,
        yourRole: req.user.role,
      });
    }
  };
};
