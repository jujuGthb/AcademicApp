const Evaluation = require("../models/Evaluation")
const Application = require("../models/Application")
const User = require("../models/User")
const fs = require("fs")

// @desc    Get all evaluations
// @route   GET /api/evaluations
// @access  Private/Admin
exports.getAllEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.find()
      .populate("application", "status")
      .populate("juryMember", "name title department")
      .sort({ createdAt: -1 })

    res.json(evaluations)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get evaluations by jury member
// @route   GET /api/evaluations/jury
// @access  Private/Jury
exports.getEvaluationsByJury = async (req, res) => {
  try {
    const evaluations = await Evaluation.find({ juryMember: req.user.id })
      .populate({
        path: "application",
        select: "status",
        populate: {
          path: "candidate jobPosting",
          select: "name title department faculty position",
        },
      })
      .sort({ createdAt: -1 })

    res.json(evaluations)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get evaluations by application
// @route   GET /api/evaluations/application/:applicationId
// @access  Private
exports.getEvaluationsByApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.applicationId)

    if (!application) {
      return res.status(404).json({ message: "Application not found" })
    }

    // Check if user is authorized to view these evaluations
    if (application.candidate.toString() !== req.user.id && req.user.role !== "admin" && req.user.role !== "manager") {
      return res.status(401).json({ message: "User not authorized" })
    }

    const evaluations = await Evaluation.find({ application: req.params.applicationId })
      .populate("juryMember", "name title department faculty")
      .sort({ createdAt: -1 })

    res.json(evaluations)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get evaluation by ID
// @route   GET /api/evaluations/:id
// @access  Private
exports.getEvaluationById = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id)
      .populate({
        path: "application",
        populate: {
          path: "candidate jobPosting",
          select: "name title department faculty position",
        },
      })
      .populate("juryMember", "name title department faculty")

    if (!evaluation) {
      return res.status(404).json({ message: "Evaluation not found" })
    }

    // Check if user is authorized to view this evaluation
    if (
      evaluation.juryMember._id.toString() !== req.user.id &&
      evaluation.application.candidate._id.toString() !== req.user.id &&
      req.user.role !== "admin" &&
      req.user.role !== "manager"
    ) {
      return res.status(401).json({ message: "User not authorized" })
    }

    res.json(evaluation)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Evaluation not found" })
    }
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Create a new evaluation
// @route   POST /api/evaluations
// @access  Private/Jury
exports.createEvaluation = async (req, res) => {
  try {
    const { applicationId, decision, comments } = req.body

    // Check if application exists
    const application = await Application.findById(applicationId)
    if (!application) {
      return res.status(404).json({ message: "Application not found" })
    }

    // Check if user is assigned as jury for this application
    // This would require a jury assignment model or field in the application
    // For now, we'll assume any jury member can evaluate any application
    if (req.user.role !== "jury") {
      return res.status(401).json({ message: "User not authorized" })
    }

    // Check if jury member already evaluated this application
    const existingEvaluation = await Evaluation.findOne({
      application: applicationId,
      juryMember: req.user.id,
    })

    if (existingEvaluation) {
      return res.status(400).json({ message: "You have already evaluated this application" })
    }

    // Process report file if provided
    let reportPath = null
    if (req.file) {
      reportPath = req.file.path.replace(/\\/g, "/") // Normalize path for all OS
    }

    const newEvaluation = new Evaluation({
      application: applicationId,
      juryMember: req.user.id,
      decision,
      comments,
      reportPath,
      submittedAt: Date.now(),
    })

    const evaluation = await newEvaluation.save()

    res.json(evaluation)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Update evaluation
// @route   PUT /api/evaluations/:id
// @access  Private/Jury
exports.updateEvaluation = async (req, res) => {
  try {
    const { decision, comments } = req.body

    const evaluation = await Evaluation.findById(req.params.id)

    if (!evaluation) {
      return res.status(404).json({ message: "Evaluation not found" })
    }

    // Check if user owns the evaluation
    if (evaluation.juryMember.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" })
    }

    // Update fields
    if (decision) evaluation.decision = decision
    if (comments) evaluation.comments = comments

    // Process report file if provided
    if (req.file) {
      // Delete old report if exists
      if (evaluation.reportPath) {
        try {
          fs.unlinkSync(evaluation.reportPath)
        } catch (error) {
          console.error(`Failed to delete file: ${evaluation.reportPath}`, error)
        }
      }

      evaluation.reportPath = req.file.path.replace(/\\/g, "/") // Normalize path for all OS
    }

    evaluation.updatedAt = Date.now()

    await evaluation.save()

    res.json(evaluation)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Delete evaluation
// @route   DELETE /api/evaluations/:id
// @access  Private/Admin
exports.deleteEvaluation = async (req, res) => {
  try {
    const evaluation = await Evaluation.findById(req.params.id)

    if (!evaluation) {
      return res.status(404).json({ message: "Evaluation not found" })
    }

    // Only admin can delete evaluations
    if (req.user.role !== "admin") {
      return res.status(401).json({ message: "User not authorized" })
    }

    // Delete report file if exists
    if (evaluation.reportPath) {
      try {
        fs.unlinkSync(evaluation.reportPath)
      } catch (error) {
        console.error(`Failed to delete file: ${evaluation.reportPath}`, error)
      }
    }

    await Evaluation.findByIdAndDelete(req.params.id)

    res.json({ message: "Evaluation removed" })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Assign jury members to application
// @route   POST /api/evaluations/assign
// @access  Private/Admin
exports.assignJuryMembers = async (req, res) => {
  try {
    const { applicationId, juryMemberIds } = req.body

    // Check if application exists
    const application = await Application.findById(applicationId)
    if (!application) {
      return res.status(404).json({ message: "Application not found" })
    }

    // Check if jury members exist
    const juryMembers = await User.find({
      _id: { $in: juryMemberIds },
      role: "jury",
    })

    if (juryMembers.length !== juryMemberIds.length) {
      return res.status(400).json({ message: "Some jury members were not found or are not jury members" })
    }

    // Create evaluation entries for each jury member
    const evaluations = []

    for (const juryMemberId of juryMemberIds) {
      // Check if jury member already assigned
      const existingEvaluation = await Evaluation.findOne({
        application: applicationId,
        juryMember: juryMemberId,
      })

      if (!existingEvaluation) {
        const newEvaluation = new Evaluation({
          application: applicationId,
          juryMember: juryMemberId,
          decision: "pending",
        })

        const evaluation = await newEvaluation.save()
        evaluations.push(evaluation)
      }
    }

    res.json({ message: "Jury members assigned successfully", evaluations })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get evaluation statistics
// @route   GET /api/evaluations/stats
// @access  Private/Admin
exports.getEvaluationStats = async (req, res) => {
  try {
    const totalEvaluations = await Evaluation.countDocuments()
    const pendingEvaluations = await Evaluation.countDocuments({ decision: "pending" })
    const positiveEvaluations = await Evaluation.countDocuments({ decision: "positive" })
    const negativeEvaluations = await Evaluation.countDocuments({ decision: "negative" })

    // Get evaluations by jury member
    const evaluationsByJury = await Evaluation.aggregate([
      {
        $group: {
          _id: "$juryMember",
          total: { $sum: 1 },
          pending: {
            $sum: {
              $cond: [{ $eq: ["$decision", "pending"] }, 1, 0],
            },
          },
          positive: {
            $sum: {
              $cond: [{ $eq: ["$decision", "positive"] }, 1, 0],
            },
          },
          negative: {
            $sum: {
              $cond: [{ $eq: ["$decision", "negative"] }, 1, 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "juryMember",
        },
      },
      {
        $unwind: "$juryMember",
      },
      {
        $project: {
          _id: 0,
          juryMemberId: "$_id",
          juryMemberName: "$juryMember.name",
          total: 1,
          pending: 1,
          positive: 1,
          negative: 1,
        },
      },
    ])

    res.json({
      totalEvaluations,
      pendingEvaluations,
      positiveEvaluations,
      negativeEvaluations,
      evaluationsByJury,
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}
