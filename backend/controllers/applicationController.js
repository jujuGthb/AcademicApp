const Application = require("../models/Application")
const JobPosting = require("../models/JobPosting")
const User = require("../models/User")
const Activity = require("../models/Activity")
const Report = require("../models/Report")
const calculationService = require("../services/calculationService")
const fs = require("fs")

// @desc    Get all applications
// @route   GET /api/applications
// @access  Private/Admin
exports.getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("candidate", "name title department faculty")
      .populate("jobPosting", "title department faculty position")
      .sort({ createdAt: -1 })

    res.json(applications)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get applications by candidate
// @route   GET /api/applications/candidate
// @access  Private
exports.getApplicationsByCandidate = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate("jobPosting", "title department faculty position startDate endDate status")
      .sort({ createdAt: -1 })

    res.json(applications)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get applications by job posting
// @route   GET /api/applications/job/:jobId
// @access  Private/Admin
exports.getApplicationsByJob = async (req, res) => {
  try {
    const applications = await Application.find({ jobPosting: req.params.jobId })
      .populate("candidate", "name title department faculty")
      .sort({ createdAt: -1 })

    res.json(applications)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get application by ID
// @route   GET /api/applications/:id
// @access  Private
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("candidate", "name title department faculty fieldArea")
      .populate("jobPosting", "title department faculty position fieldArea")
      .populate("report")

    if (!application) {
      return res.status(404).json({ message: "Application not found" })
    }

    // Check if user is authorized to view this application
    if (
      application.candidate._id.toString() !== req.user.id &&
      req.user.role !== "admin" &&
      req.user.role !== "manager" &&
      req.user.role !== "jury"
    ) {
      return res.status(401).json({ message: "User not authorized" })
    }

    res.json(application)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Application not found" })
    }
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Create a new application
// @route   POST /api/applications
// @access  Private
exports.createApplication = async (req, res) => {
  try {
    const { jobPostingId, reportId, activityIds } = req.body

    // Check if job posting exists
    const jobPosting = await JobPosting.findById(jobPostingId)
    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting not found" })
    }

    // Check if job posting is still open
    if (jobPosting.status !== "published") {
      return res.status(400).json({ message: "Job posting is not open for applications" })
    }

    // Check if user already applied for this job
    const existingApplication = await Application.findOne({
      jobPosting: jobPostingId,
      candidate: req.user.id,
    })

    if (existingApplication) {
      return res.status(400).json({ message: "You have already applied for this job" })
    }

    // Get report if provided
    let report = null
    if (reportId) {
      report = await Report.findById(reportId)
      if (!report) {
        return res.status(404).json({ message: "Report not found" })
      }

      // Check if user owns the report
      if (report.user.toString() !== req.user.id) {
        return res.status(401).json({ message: "User not authorized to use this report" })
      }
    }

    // Get activities if provided
    let activities = []
    if (activityIds && activityIds.length > 0) {
      activities = await Activity.find({
        _id: { $in: activityIds },
        user: req.user.id,
      })

      if (activities.length !== activityIds.length) {
        return res.status(400).json({ message: "Some activities were not found or do not belong to the user" })
      }
    }

    // Calculate total points and category points
    const { totalPoints, categoryPoints } = calculationService.calculateTotalPoints(activities)

    // Count activities by type
    const activityCounts = calculationService.countActivities(activities)

    // Process file attachments
    const documents = req.files
      ? req.files.map((file) => ({
          name: file.originalname,
          path: file.path.replace(/\\/g, "/"), // Normalize path for all OS
          category: file.fieldname,
          uploadDate: Date.now(),
        }))
      : []

    const newApplication = new Application({
      jobPosting: jobPostingId,
      candidate: req.user.id,
      report: reportId,
      activities: activityIds,
      totalPoints,
      categoryPoints,
      activityCounts,
      documents,
      status: "pending",
      submittedAt: Date.now(),
    })

    const application = await newApplication.save()

    res.json(application)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private/Admin
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body

    const application = await Application.findById(req.params.id)

    if (!application) {
      return res.status(404).json({ message: "Application not found" })
    }

    // Only admin or manager can update status
    if (req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(401).json({ message: "User not authorized" })
    }

    application.status = status
    application.updatedAt = Date.now()

    await application.save()

    res.json(application)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Add document to application
// @route   PUT /api/applications/:id/documents
// @access  Private
exports.addDocumentToApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)

    if (!application) {
      return res.status(404).json({ message: "Application not found" })
    }

    // Check if user owns the application
    if (application.candidate.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" })
    }

    // Process file attachments
    const newDocuments = req.files
      ? req.files.map((file) => ({
          name: file.originalname,
          path: file.path.replace(/\\/g, "/"), // Normalize path for all OS
          category: file.fieldname,
          uploadDate: Date.now(),
        }))
      : []

    application.documents = [...application.documents, ...newDocuments]
    application.updatedAt = Date.now()

    await application.save()

    res.json(application)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Remove document from application
// @route   DELETE /api/applications/:id/documents/:documentId
// @access  Private
exports.removeDocumentFromApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)

    if (!application) {
      return res.status(404).json({ message: "Application not found" })
    }

    // Check if user owns the application
    if (application.candidate.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" })
    }

    // Find document
    const document = application.documents.id(req.params.documentId)

    if (!document) {
      return res.status(404).json({ message: "Document not found" })
    }

    // Delete file from disk
    try {
      fs.unlinkSync(document.path)
    } catch (error) {
      console.error(`Failed to delete file: ${document.path}`, error)
    }

    // Remove document from array
    application.documents.pull(req.params.documentId)
    application.updatedAt = Date.now()

    await application.save()

    res.json(application)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Verify document in application
// @route   PUT /api/applications/:id/documents/:documentId/verify
// @access  Private/Admin
exports.verifyDocument = async (req, res) => {
  try {
    const { verified } = req.body

    const application = await Application.findById(req.params.id)

    if (!application) {
      return res.status(404).json({ message: "Application not found" })
    }

    // Only admin or manager can verify documents
    if (req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(401).json({ message: "User not authorized" })
    }

    // Find document
    const document = application.documents.id(req.params.documentId)

    if (!document) {
      return res.status(404).json({ message: "Document not found" })
    }

    // Update document verification status
    document.verified = verified
    application.updatedAt = Date.now()

    await application.save()

    res.json(application)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)

    if (!application) {
      return res.status(404).json({ message: "Application not found" })
    }

    // Check if user owns the application or is admin
    if (application.candidate.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({ message: "User not authorized" })
    }

    // Delete documents from disk
    for (const document of application.documents) {
      try {
        fs.unlinkSync(document.path)
      } catch (error) {
        console.error(`Failed to delete file: ${document.path}`, error)
      }
    }

    await Application.findByIdAndDelete(req.params.id)

    res.json({ message: "Application removed" })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}
