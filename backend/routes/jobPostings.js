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

module.exports = router
