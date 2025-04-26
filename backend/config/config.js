require("dotenv").config()

module.exports = {
  mongoURI: process.env.MONGO_URI || "mongodb://localhost:27017/academic-promotion",
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || "academic_promotion_secret_key",
  jwtExpiration: "5d",
  uploadDir: "uploads/",
  emailFrom: process.env.EMAIL_FROM || "noreply@academicapp.com",
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
}
