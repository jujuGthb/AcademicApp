const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const config = require("./config/config");
const { errorHandler } = require("./utils/errorHandler");
const path = require("path");

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB()
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(`MongoDB Connection Error: ${err.message}`));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import routes
const userRoutes = require("./routes/users");
const jobPostingRoutes = require("./routes/jobPostings");
const activityRoutes = require("./routes/activities");
const reportRoutes = require("./routes/reports");
const criteriaRoutes = require("./routes/criteria");
const uploadRoutes = require("./routes/uploads");
const applicationRoutes = require("./routes/applications");
const evaluationRoutes = require("./routes/evaluations");

app.use((req, res, next) => {
  //console.log(req);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

//console.log("hello");
// Define Routes
app.use("/api/users", userRoutes);
app.use("/api/job-postings", jobPostingRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/criteria", criteriaRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/evaluations", evaluationRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("API is running");
});

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = config.port || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
