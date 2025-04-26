const express = require("express")
const router = express.Router()
const mongoose = require("mongoose")
const auth = require("../middleware/auth")
const upload = require("../middleware/upload")
const Report = require("../models/Report")
const Activity = require("../models/Activity")
const User = require("../models/User")
const Criteria = require("../models/Criteria")
const fs = require("fs")

// @route   GET api/reports
// @desc    Get all reports for a user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id }).sort({ createdAt: -1 })
    res.json(reports)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Sunucu hatası" })
  }
})

// @route   POST api/reports
// @desc    Create a report
// @access  Private
router.post("/", auth, upload.array("attachments", 5), async (req, res) => {
  const { targetTitle, isFirstAppointment, startDate, endDate } = req.body

  try {
    const user = await User.findById(req.user.id)

    // Get activities within date range
    const activities = await Activity.find({
      user: req.user.id,
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
    })

    // Calculate total points and category points
    let totalPoints = 0
    const categoryPoints = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
      F: 0,
      G: 0,
      H: 0,
      I: 0,
      J: 0,
      K: 0,
      L: 0,
    }

    activities.forEach((activity) => {
      totalPoints += activity.calculatedPoints
      categoryPoints[activity.category] += activity.calculatedPoints
    })

    // Count activities by type
    const publicationCount = activities.filter((a) => a.category === "A").length
    const mainAuthorCount = activities.filter((a) => a.category === "A" && a.isMainAuthor).length
    const projectCount = activities.filter((a) => a.category === "H").length
    const thesisCount = activities.filter((a) => a.category === "F").length
    const sciPublicationCount = activities.filter(
      (a) => a.category === "A" && ["SCI-E", "SSCI", "AHCI"].includes(a.indexType),
    ).length
    const internationalPublicationCount = activities.filter(
      (a) =>
        a.category === "A" && ["SCI-E", "SSCI", "AHCI", "ESCI", "Scopus", "Diğer Uluslararası"].includes(a.indexType),
    ).length
    const nationalPublicationCount = activities.filter(
      (a) => a.category === "A" && ["TR Dizin", "Diğer Ulusal"].includes(a.indexType),
    ).length
    const personalExhibitionCount = activities.filter(
      (a) => a.category === "L" && ["L.5", "L.6"].includes(a.subcategory),
    ).length
    const groupExhibitionCount = activities.filter(
      (a) => a.category === "L" && ["L.7", "L.8"].includes(a.subcategory),
    ).length

    // Process file attachments
    const attachments = req.files.map((file) => ({
      name: file.originalname,
      path: file.path.replace(/\\/g, "/"), // Normalize path for all OS
    }))

    const newReport = new Report({
      user: req.user.id,
      targetTitle,
      isFirstAppointment: isFirstAppointment === "true",
      startDate,
      endDate,
      totalPoints,
      categoryPoints,
      activityCounts: {
        publications: publicationCount,
        mainAuthor: mainAuthorCount,
        projects: projectCount,
        theses: thesisCount,
        sciPublications: sciPublicationCount,
        internationalPublications: internationalPublicationCount,
        nationalPublications: nationalPublicationCount,
        personalExhibitions: personalExhibitionCount,
        groupExhibitions: groupExhibitionCount,
      },
      activities: activities.map((activity) => activity._id),
      attachments,
      status: "draft",
    })

    const report = await newReport.save()
    res.json(report)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Sunucu hatası" })
  }
})

// @route   GET api/reports/:id
// @desc    Get report by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)

    if (!report) {
      return res.status(404).json({ message: "Rapor bulunamadı" })
    }

    // Check if user owns the report
    if (report.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Yetkilendirme reddedildi" })
    }

    res.json(report)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Sunucu hatası" })
  }
})

// @route   PUT api/reports/:id
// @desc    Update report status
// @access  Private
router.put("/:id", auth, upload.array("attachments", 5), async (req, res) => {
  const { status, reviewNotes, removeAttachments } = req.body

  try {
    let report = await Report.findById(req.params.id)

    if (!report) {
      return res.status(404).json({ message: "Rapor bulunamadı" })
    }

    // Check if user owns the report
    if (report.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Yetkilendirme reddedildi" })
    }

    // Process file attachments
    let attachments = [...report.attachments]

    // Remove attachments if specified
    if (removeAttachments) {
      const attachmentsToRemove = removeAttachments.split(",")

      // Delete files from disk
      for (const attachmentId of attachmentsToRemove) {
        const attachment = attachments.find((a) => a._id.toString() === attachmentId)
        if (attachment) {
          try {
            fs.unlinkSync(attachment.path)
          } catch (error) {
            console.error(`Failed to delete file: ${attachment.path}`, error)
          }
        }
      }

      // Filter out removed attachments
      attachments = attachments.filter((a) => !attachmentsToRemove.includes(a._id.toString()))
    }

    // Add new attachments
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map((file) => ({
        name: file.originalname,
        path: file.path.replace(/\\/g, "/"), // Normalize path for all OS
      }))

      attachments = [...attachments, ...newAttachments]
    }

    // Update submittedAt if status is changing to submitted
    const submittedAt = status === "submitted" && report.status !== "submitted" ? new Date() : report.submittedAt

    report = await Report.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          status,
          reviewNotes,
          attachments,
          submittedAt,
        },
      },
      { new: true },
    )

    res.json(report)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Sunucu hatası" })
  }
})

// @route   DELETE api/reports/:id
// @desc    Delete a report
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)

    if (!report) {
      return res.status(404).json({ message: "Rapor bulunamadı" })
    }

    // Check if user owns the report
    if (report.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Yetkilendirme reddedildi" })
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
    res.json({ message: "Rapor silindi" })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Sunucu hatası" })
  }
})

// @route   GET api/reports/:id/activities
// @desc    Get activities for a report
// @access  Private
router.get("/:id/activities", auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)

    if (!report) {
      return res.status(404).json({ message: "Rapor bulunamadı" })
    }

    // Check if user owns the report
    if (report.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Yetkilendirme reddedildi" })
    }

    const activities = await Activity.find({
      _id: { $in: report.activities },
    }).sort({ category: 1, date: -1 })

    res.json(activities)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Sunucu hatası" })
  }
})

// @route   GET api/reports/:id/check-criteria
// @desc    Check if report meets criteria
// @access  Private
router.get("/:id/check-criteria", auth, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id).populate("user", "fieldArea")

    if (!report) {
      return res.status(404).json({ message: "Rapor bulunamadı" })
    }

    // Check if user owns the report
    if (report.user._id.toString() !== req.user.id) {
      return res.status(401).json({ message: "Yetkilendirme reddedildi" })
    }

    // Get criteria for the field area and target title
    const criteria = await Criteria.findOne({
      fieldArea: report.user.fieldArea,
      targetTitle: report.targetTitle,
      isFirstAppointment: report.isFirstAppointment,
    })

    if (!criteria) {
      return res.status(404).json({ message: "Bu alan ve unvan için kriter bulunamadı" })
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
    res.status(500).json({ message: "Sunucu hatası" })
  }
})

module.exports = router
