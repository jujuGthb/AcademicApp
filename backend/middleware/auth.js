const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports = (req, res, next) => {
  let authHeader = req.header("Authorization") || req.header("x-auth-token");
  console.log(req.header("x-auth-token"));
  //console.log(req.header("Authorization"));
  if (req.header("x-auth-token")) {
    authHeader = "Bearer " + req.header("x-auth-token");
  }

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    res.status(401).json({ message: "Token is not valid" });
  }
};
