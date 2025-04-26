const Report = require("../models/Report")
const Activity = require("../models/Activity")
const User = require("../models/User")
const Criteria = require("../models/Criteria")
const calculationService = require("../services/calculationService")
const fs = require("fs")

// @desc    Get all reports for a user
// @route   GET /api/reports
// @access  Private
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(reports)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get all reports (admin)
// @route   GET /api/reports/all
// @access  Private/Admin
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate("user", "name title department faculty").sort({ createdAt: -1 })
    res.json(reports)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get report by ID
// @route   GET /api/reports/:id
// @access  Private
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)

    if (!report) {
      return res.status(404).json({ message: "Report not found" })
    }

    // Check if user owns the report or is admin
    if (report.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({ message: "User not authorized" })
    }

    res.json(report)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Report not found" })
    }
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Create a report
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res) => {
  try {
    const { targetTitle, isFirstAppointment, startDate, endDate } = req.body

    const user = await User.findById(req.user.id)

    // Get activities within date range
    const activities = await Activity.find({
      user: req.user.id,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    })

    // Calculate total points and category points
    const { totalPoints, categoryPoints } = calculationService.calculateTotalPoints(activities)

    // Count activities by type
    const activityCounts = calculationService.countActivities(activities)

    // Process file attachments
    const attachments = req.files
      ? req.files.map((file) => ({
          name: file.originalname,
          path: file.path.replace(/\\/g, "/"), // Normalize path for all OS
          uploadDate: Date.now(),
        }))
      : []

    const newReport = new Report({
      user: req.user.id,
      targetTitle,
      isFirstAppointment: isFirstAppointment === "true",
      startDate,
      endDate,
      totalPoints,
      categoryPoints,
      activityCounts,
      activities: activities.map((activity) => activity._id),
      attachments,
      status: "draft",
    })

    const report = await newReport.save()
    res.json(report)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Update report status
// @route   PUT /api/reports/:id/status
// @access  Private
exports.updateReportStatus = async (req, res) => {
  try {
    const { status, reviewNotes } = req.body

    const report = await Report.findById(req.params.id)

    if (!report) {
      return res.status(404).json({ message: "Report not found" })
    }

    // Check if user owns the report or is admin
    if (report.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({ message: "User not authorized" })
    }

    // Update submittedAt if status is changing to submitted
    const submittedAt = status === "submitted" && report.status !== "submitted" ? new Date() : report.submittedAt

    report.status = status
    if (reviewNotes) report.reviewNotes = reviewNotes
    report.submittedAt = submittedAt

    await report.save()

    res.json(report)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Add attachments to report
// @route   PUT /api/reports/:id/attachments
// @access  Private
exports.addAttachmentsToReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)

    if (!report) {
      return res.status(404).json({ message: "Report not found" })
    }

    // Check if user owns the report
    if (report.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" })
    }

    // Process file attachments
    const newAttachments = req.files
      ? req.files.map((file) => ({
          name: file.originalname,
          path: file.path.replace(/\\/g, "/"), // Normalize path for all OS
          uploadDate: Date.now(),
        }))
      : []

    report.attachments = [...report.attachments, ...newAttachments]

    await report.save()

    res.json(report)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Remove attachment from report
// @route   DELETE /api/reports/:id/attachments/:attachmentId
// @access  Private
exports.removeAttachmentFromReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)

    if (!report) {
      return res.status(404).json({ message: "Report not found" })
    }

    // Check if user owns the report
    if (report.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" })
    }

    // Find attachment
    const attachment = report.attachments.id(req.params.attachmentId)

    if (!attachment) {
      return res.status(404).json({ message: "Attachment not found" })
    }

    // Delete file from disk
    try {
      fs.unlinkSync(attachment.path)
    } catch (error) {
      console.error(`Failed to delete file: ${attachment.path}`, error)
    }

    // Remove attachment from array
    report.attachments.pull(req.params.attachmentId)

    await report.save()

    res.json(report)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Delete a report
// @route   DELETE /api/reports/:id
// @access  Private
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)

    if (!report) {
      return res.status(404).json({ message: "Report not found" })
    }

    // Check if user owns the report or is admin
    if (report.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({ message: "User not authorized" })
    }

    // Delete attachments from disk
    for (const attachment of report.attachments) {
      try {
        fs.unlinkSync(attachment.path)
      } catch (error) {
        console.error(`Failed to delete file: ${attachment.path}`, error)
      }
    }

    await Report.findByIdAndDelete(req.params.id)

    res.json({ message: "Report removed" })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get activities for a report
// @route   GET /api/reports/:id/activities
// @access  Private
exports.getReportActivities = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)

    if (!report) {
      return res.status(404).json({ message: "Report not found" })
    }

    // Check if user owns the report or is admin
    if (report.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({ message: "User not authorized" })
    }

    const activities = await Activity.find({
      _id: { $in: report.activities },
    }).sort({ category: 1, date: -1 })

    res.json(activities)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Check if report meets criteria
// @route   GET /api/reports/:id/check-criteria
// @access  Private
exports.checkReportCriteria = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate("user", "fieldArea")

    if (!report) {
      return res.status(404).json({ message: "Report not found" })
    }

    // Check if user owns the report or is admin
    if (report.user._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({ message: "User not authorized" })
    }

    // Get criteria for the field area and target title
    const criteria = await Criteria.findOne({
      fieldArea: report.user.fieldArea,
      targetTitle: report.targetTitle,
      isFirstAppointment: report.isFirstAppointment,
    })

    if (!criteria) {
      return res.status(404).json({ message: "No criteria found for this field and title" })
    }

    // Check if report meets criteria
    const result = {
      meetsRequirements: true,
      details: {
        totalPoints: {
          required: criteria.minimumRequirements.totalPoints,
          actual: report.totalPoints,
          meets: report.totalPoints >= criteria.minimumRequirements.totalPoints,
        },
        categoryPoints: {},
        activityCounts: {},
      },
    }

    // Check category points
    for (const category in criteria.minimumRequirements.categoryPoints) {
      if (criteria.minimumRequirements.categoryPoints[category] > 0) {
        const required = criteria.minimumRequirements.categoryPoints[category]
        const actual = report.categoryPoints[category] || 0
        const meets = actual >= required

        result.details.categoryPoints[category] = { required, actual, meets }

        if (!meets) {
          result.meetsRequirements = false
        }
      }
    }

    // Check activity counts
    for (const countType in criteria.minimumRequirements.activityCounts) {
      if (criteria.minimumRequirements.activityCounts[countType] > 0) {
        const required = criteria.minimumRequirements.activityCounts[countType]
        const actual = report.activityCounts[countType] || 0
        const meets = actual >= required

        result.details.activityCounts[countType] = { required, actual, meets }

        if (!meets) {
          result.meetsRequirements = false
        }
      }
    }

    // Check maximum limits
    result.details.maximumLimits = {}

    for (const category in criteria.maximumLimits.categoryPoints) {
      const limit = criteria.maximumLimits.categoryPoints[category]
      const actual = report.categoryPoints[category] || 0
      const exceeds = actual > limit

      result.details.maximumLimits[category] = { limit, actual, exceeds }

      // If exceeds, we don't fail the requirements, but we note it
      if (exceeds) {
        result.details.maximumLimits[category].adjusted = limit
      }
    }

    res.json(result)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Generate PDF report
// @route   POST /api/reports/:id/generate-pdf
// @access  Private
exports.generatePdfReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate("user", "name title department faculty fieldArea")
      .populate("activities")

    if (!report) {
      return res.status(404).json({ message: "Report not found" })
    }

    // Check if user owns the report or is admin
    if (report.user._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({ message: "User not authorized" })
    }

    // This would typically use a PDF generation service
    // For now, we'll just return a success message
    res.json({ message: "PDF generation would happen here", report })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}
