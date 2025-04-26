const jwt = require("jsonwebtoken")
const config = require("../config/config")

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header("x-auth-token")

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" })
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, config.jwtSecret)
    req.user = decoded.user
    next()
  } catch (err) {
    console.error("Token verification error:", err.message)
    res.status(401).json({ message: "Token is not valid" })
  }
}
