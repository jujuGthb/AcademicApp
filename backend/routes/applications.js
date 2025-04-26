const express = require("express")
const router = express.Router()
const applicationController = require("../controllers/applicationController")
const auth = require("../middleware/auth")
const roleCheck = require("../middleware/roleCheck")
const upload = require("../middleware/upload")

// @route   GET api/applications
// @desc    Get all applications
// @access  Private/Admin
router.get("/", [auth, roleCheck("admin", "manager")], applicationController.getAllApplications)

// @route   GET api/applications/candidate
// @desc    Get applications by candidate
// @access  Private
router.get("/candidate", auth, applicationController.getApplicationsByCandidate)

// @route   GET api/applications/job/:jobId
// @desc    Get applications by job posting
// @access  Private/Admin
router.get("/job/:jobId", [auth, roleCheck("admin", "manager")], applicationController.getApplicationsByJob)

// @route   GET api/applications/:id
// @desc    Get application by ID
// @access  Private
router.get("/:id", auth, applicationController.getApplicationById)

// @route   POST api/applications
// @desc    Create a new application
// @access  Private
router.post("/", [auth, upload.array("documents", 10)], applicationController.createApplication)

// @route   PUT api/applications/:id/status
// @desc    Update application status
// @access  Private/Admin
router.put("/:id/status", [auth, roleCheck("admin", "manager")], applicationController.updateApplicationStatus)

// @route   PUT api/applications/:id/documents
// @desc    Add document to application
// @access  Private
router.put("/:id/documents", [auth, upload.array("documents", 10)], applicationController.addDocumentToApplication)

// @route   DELETE api/applications/:id/documents/:documentId
// @desc    Remove document from application
// @access  Private
router.delete("/:id/documents/:documentId", auth, applicationController.removeDocumentFromApplication)

// @route   PUT api/applications/:id/documents/:documentId/verify
// @desc    Verify document in application
// @access  Private/Admin
router.put(
  "/:id/documents/:documentId/verify",
  [auth, roleCheck("admin", "manager")],
  applicationController.verifyDocument,
)

// @route   DELETE api/applications/:id
// @desc    Delete application
// @access  Private
router.delete("/:id", auth, applicationController.deleteApplication)

module.exports = router
