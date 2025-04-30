const express = require("express")
const router = express.Router()
const jobPostingController = require("../controllers/jobPostingController")
const auth = require("../middleware/auth")
const roleCheck = require("../middleware/roleCheck")


// @route   GET api/job-postings
// @desc    Get all job postings
// @access  Public
router.get("/", jobPostingController.getAllJobPostings)

// @route   GET api/job-postings/status/:status
// @desc    Get job postings by status
// @access  Public
 router.get("/status/:status", jobPostingController.getJobPostingsByStatus)

// @route   GET api/job-postings/:id
// @desc    Get job posting by ID
// @access  Public
router.get("/:id", jobPostingController.getJobPostingById)

// @route   POST api/job-postings
// @desc    Create a job posting
// @access  Private/Admin
router.post("/", [auth, roleCheck("admin")], jobPostingController.createJobPosting)

// @route   PUT api/job-postings/:id
// @desc    Update a job posting
// @access  Private/Admin
router.put("/:id", [auth, roleCheck("admin")], jobPostingController.updateJobPosting)

// @route   DELETE api/job-postings/:id
// @desc    Delete a job posting
// @access  Private/Admin
router.delete("/:id", [auth, roleCheck("admin")], jobPostingController.deleteJobPosting)



// @route   POST /api/job-postings
// @desc    Create a new job posting
// @access  Private (Admin only)
router.post(
  "/",
  [auth, roleCheck("admin")],
  jobPostingController.createJobPosting
);

// @route   GET /api/job-postings
// @desc    Get all job postings
// @access  Private
router.get("/", auth, jobPostingController.getAllJobPostings);

// @route   GET /api/job-postings/:id
// @desc    Get job posting by ID
// @access  Private
router.get("/:id", auth, jobPostingController.getJobPostingById);

// @route   PUT /api/job-postings/:id
// @desc    Update job posting
// @access  Private (Admin only)
router.put(
  "/:id",
  [auth, roleCheck("admin")],
  jobPostingController.updateJobPosting
);

// @route   DELETE /api/job-postings/:id
// @desc    Delete job posting
// @access  Private (Admin only)
router.delete(
  "/:id",
  [auth, roleCheck("admin")],
  jobPostingController.deleteJobPosting
);

// @route   PATCH /api/job-postings/:id/status
// @desc    Update job posting status
// @access  Private (Admin only)
router.patch(
  "/:id/status",
  [auth, roleCheck("admin")],
  jobPostingController.updateJobPostingStatus
);

// @route   GET /api/job-postings/:id/stats
// @desc    Get application statistics for a job posting
// @access  Private (Admin and Manager only)
router.get(
  "/:id/stats",
  [auth, roleCheck(["admin", "manager"])],
  jobPostingController.getJobPostingStats
);

module.exports = router;
