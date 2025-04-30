const User = require("../models/User");
const Application = require("../models/Application");
const JuryAssignment = require("../models/JuryAssignment");
const JobPosting = require("../models/JobPosting");
const mongoose = require("mongoose");

// @desc    Assign jury members to an application
// @route   POST /api/jury/assign
// @access  Private (Manager only)
exports.assignJuryMembers = async (req, res) => {
  try {
    const { applicationId, juryMemberIds, dueDate } = req.body;

    // Validate input
    if (
      !applicationId ||
      !juryMemberIds ||
      !Array.isArray(juryMemberIds) ||
      !dueDate
    ) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    // Check if application exists
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if job posting exists
    const jobPosting = await JobPosting.findById(application.jobPosting);
    if (!jobPosting) {
      return res.status(404).json({ message: "Job posting not found" });
    }

    // Verify all jury members exist and have jury role
    const juryMembers = await User.find({
      _id: { $in: juryMemberIds },
      role: "jury",
    });

    if (juryMembers.length !== juryMemberIds.length) {
      return res
        .status(400)
        .json({
          message: "One or more jury members not found or not a jury member",
        });
    }

    // Create jury assignments
    const assignments = [];
    for (const juryMemberId of juryMemberIds) {
      // Check if assignment already exists
      const existingAssignment = await JuryAssignment.findOne({
        application: applicationId,
        juryMember: juryMemberId,
      });

      if (!existingAssignment) {
        const assignment = new JuryAssignment({
          jobPosting: application.jobPosting,
          application: applicationId,
          juryMember: juryMemberId,
          assignedBy: req.user.id,
          dueDate: new Date(dueDate),
        });

        await assignment.save();
        assignments.push(assignment);
      }
    }

    // Update application status to under_review if it's in submitted status
    if (application.status === "submitted") {
      application.status = "under_review";
      await application.save();
    }

    // Update application jury members
    const juryMembersArray = juryMemberIds.map((id) => ({
      juryMember: id,
      status: "pending",
    }));

    await Application.findByIdAndUpdate(applicationId, {
      $set: { juryMembers: juryMembersArray },
    });

    // Send notification to jury members (this would be implemented with a notification system)
    // For now, we'll just log it
    console.log(
      `Notifications sent to ${juryMembers.length} jury members for application ${applicationId}`
    );

    res.status(201).json({
      message: "Jury members assigned successfully",
      assignmentsCount: assignments.length,
    });
  } catch (err) {
    console.error("Error assigning jury members:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Get jury assignments for a specific application
// @route   GET /api/jury/assignments/:applicationId
// @access  Private (Manager only)
exports.getJuryAssignmentsByApplication = async (req, res) => {
  try {
    const assignments = await JuryAssignment.find({
      application: req.params.applicationId,
    })
      .populate("juryMember", "name email")
      .populate("assignedBy", "name email");

    res.json(assignments);
  } catch (err) {
    console.error("Error fetching jury assignments:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Get all jury members
// @route   GET /api/jury/members
// @access  Private (Manager only)
exports.getAllJuryMembers = async (req, res) => {
  try {
    const juryMembers = await User.find({ role: "jury" }).select("-password");
    res.json(juryMembers);
  } catch (err) {
    console.error("Error fetching jury members:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Make final decision on application
// @route   POST /api/jury/decision/:applicationId
// @access  Private (Manager only)
exports.makeFinalDecision = async (req, res) => {
  try {
    const { decision, comments } = req.body;

    // Validate decision
    if (!decision || !["approved", "rejected"].includes(decision)) {
      return res.status(400).json({ message: "Invalid decision" });
    }

    // Check if application exists
    const application = await Application.findById(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if all jury members have submitted their evaluations
    const assignments = await JuryAssignment.find({
      application: req.params.applicationId,
    });
    const pendingAssignments = assignments.filter(
      (assignment) => assignment.status !== "completed"
    );

    if (pendingAssignments.length > 0) {
      return res.status(400).json({
        message:
          "Cannot make final decision until all jury members have submitted their evaluations",
        pendingCount: pendingAssignments.length,
      });
    }

    // Update application with final decision
    const updatedApplication = await Application.findByIdAndUpdate(
      req.params.applicationId,
      {
        $set: {
          status: decision === "approved" ? "approved" : "rejected",
          finalDecision: {
            decision,
            comments: comments || "",
            decisionDate: new Date(),
            decidedBy: req.user.id,
          },
        },
      },
      { new: true }
    );

    // Send notification to applicant (this would be implemented with a notification system)
    // For now, we'll just log it
    console.log(
      `Notification sent to applicant for application ${req.params.applicationId}: ${decision}`
    );

    res.json({
      message: `Application ${decision}`,
      application: updatedApplication,
    });
  } catch (err) {
    console.error("Error making final decision:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Get application statistics
// @route   GET /api/jury/statistics
// @access  Private (Manager only)
exports.getApplicationStatistics = async (req, res) => {
  try {
    const { startDate, endDate, position, department } = req.query;

    // Build query
    const query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Get job postings if position or department is specified
    if (position || department) {
      const jobPostingQuery = {};
      if (position) jobPostingQuery.position = position;
      if (department) jobPostingQuery.department = department;

      const jobPostings = await JobPosting.find(jobPostingQuery).select("_id");
      query.jobPosting = { $in: jobPostings.map((jp) => jp._id) };
    }

    // Get application statistics
    const totalApplications = await Application.countDocuments(query);
    const pendingApplications = await Application.countDocuments({
      ...query,
      status: "submitted",
    });
    const inReviewApplications = await Application.countDocuments({
      ...query,
      status: "under_review",
    });
    const approvedApplications = await Application.countDocuments({
      ...query,
      status: "approved",
    });
    const rejectedApplications = await Application.countDocuments({
      ...query,
      status: "rejected",
    });

    // Get statistics by position
    const applicationsByPosition = await JobPosting.aggregate([
      {
        $lookup: {
          from: "applications",
          localField: "_id",
          foreignField: "jobPosting",
          as: "applications",
        },
      },
      {
        $match: {
          "applications.0": { $exists: true },
        },
      },
      {
        $group: {
          _id: "$position",
          count: { $sum: { $size: "$applications" } },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    res.json({
      totalApplications,
      pendingApplications,
      inReviewApplications,
      approvedApplications,
      rejectedApplications,
      applicationsByPosition,
    });
  } catch (err) {
    console.error("Error getting application statistics:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
