// const roleCheck = (...roles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ message: "Unauthorized" })
//     }

//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({ message: "Forbidden - Insufficient permissions" })
//     }

//     next()
//   }
// }

// module.exports = roleCheck

// Middleware to check if user has the required role
module.exports = (role) => {
  return (req, res, next) => {
    // Check if user exists and has a role property
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // If multiple roles are allowed
    if (Array.isArray(role)) {
      if (!role.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: "Not authorized for this resource" });
      }
    } else {
      // If only one role is allowed
      if (req.user.role !== role) {
        return res
          .status(403)
          .json({ message: "Not authorized for this resource" });
      }
    }

    next();
  };
};
