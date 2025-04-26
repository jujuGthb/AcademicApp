const Activity = require("../models/Activity");
const User = require("../models/User");
const calculationService = require("../services/calculationService");
const fs = require("fs");
const path = require("path");

// @desc    Get all activities for a user
// @route   GET /api/activities
// @access  Private
exports.getActivities = async (req, res) => {
  console.log("allativities");
  try {
    const activities = await Activity.find({ user: req.params.id }).sort({
      date: -1,
    });
    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get activity by ID
// @route   GET /api/activities/:id
// @access  Private
exports.getActivityById = async (req, res) => {
  console.log("actIdr");
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Check if user owns the activity
    if (activity.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    res.json(activity);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a new activity
// @route   POST /api/activities
// @access  Private
exports.createActivity = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      title,
      description,
      authors,
      date,
      journal,
      volume,
      issue,
      pages,
      doi,
      indexType,
      quartile,
      authorCount,
      isMainAuthor,
      basePoints,
    } = req.body;

    // Calculate points based on author count and main author status
    const calculatedPoints = calculationService.calculatePoints({
      basePoints: Number.parseFloat(basePoints),
      authorCount: Number.parseInt(authorCount),
      isMainAuthor: isMainAuthor === "true",
    });

    // Process file attachments
    const attachments = req.files
      ? req.files.map((file) => ({
          name: file.originalname,
          path: file.path.replace(/\\/g, "/"), // Normalize path for all OS
        }))
      : [];

    const newActivity = new Activity({
      user: req.user.id,
      category,
      subcategory,
      title,
      description,
      authors,
      date,
      journal,
      volume,
      issue,
      pages,
      doi,
      indexType,
      quartile,
      authorCount: Number.parseInt(authorCount),
      isMainAuthor: isMainAuthor === "true",
      basePoints: Number.parseFloat(basePoints),
      calculatedPoints,
      attachments,
    });

    const activity = await newActivity.save();
    res.json(activity);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update an activity
// @route   PUT /api/activities/:id
// @access  Private
exports.updateActivity = async (req, res) => {
  try {
    let activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Check if user owns the activity
    if (activity.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    const {
      category,
      subcategory,
      title,
      description,
      authors,
      date,
      journal,
      volume,
      issue,
      pages,
      doi,
      indexType,
      quartile,
      authorCount,
      isMainAuthor,
      basePoints,
      removeAttachments,
    } = req.body;

    // Calculate points based on author count and main author status
    const calculatedPoints = calculationService.calculatePoints({
      basePoints: Number.parseFloat(basePoints),
      authorCount: Number.parseInt(authorCount),
      isMainAuthor: isMainAuthor === "true",
    });

    // Process file attachments
    let attachments = [...activity.attachments];

    // Remove attachments if specified
    if (removeAttachments) {
      const attachmentsToRemove = removeAttachments.split(",");

      // Delete files from disk
      for (const attachmentId of attachmentsToRemove) {
        const attachment = attachments.find(
          (a) => a._id.toString() === attachmentId
        );
        if (attachment) {
          try {
            fs.unlinkSync(attachment.path);
          } catch (error) {
            console.error(`Failed to delete file: ${attachment.path}`, error);
          }
        }
      }

      // Filter out removed attachments
      attachments = attachments.filter(
        (a) => !attachmentsToRemove.includes(a._id.toString())
      );
    }

    // Add new attachments
    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map((file) => ({
        name: file.originalname,
        path: file.path.replace(/\\/g, "/"), // Normalize path for all OS
      }));

      attachments = [...attachments, ...newAttachments];
    }

    // Update activity
    activity = await Activity.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          category,
          subcategory,
          title,
          description,
          authors,
          date,
          journal,
          volume,
          issue,
          pages,
          doi,
          indexType,
          quartile,
          authorCount: Number.parseInt(authorCount),
          isMainAuthor: isMainAuthor === "true",
          basePoints: Number.parseFloat(basePoints),
          calculatedPoints,
          attachments,
        },
      },
      { new: true }
    );

    res.json(activity);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete an activity
// @route   DELETE /api/activities/:id
// @access  Private
exports.deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    // Check if user owns the activity
    if (activity.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }

    // Delete attachments from disk
    for (const attachment of activity.attachments) {
      try {
        fs.unlinkSync(attachment.path);
      } catch (error) {
        console.error(`Failed to delete file: ${attachment.path}`, error);
      }
    }

    await Activity.findByIdAndDelete(req.params.id);
    res.json({ message: "Activity removed" });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Activity not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get activities by category
// @route   GET /api/activities/category/:category
// @access  Private
exports.getActivitiesByCategory = async (req, res) => {
  try {
    const activities = await Activity.find({
      user: req.user.id,
      category: req.params.category,
    }).sort({ date: -1 });

    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get activity statistics
// @route   GET /api/activities/stats/summary
// @access  Private
exports.getActivityStats = async (req, res) => {
  console.log("activityStats");
  try {
    const user = await User.findById(req.user.id);

    // Get activities
    const activities = await Activity.find({ user: req.user.id });

    // Calculate total points and category points
    const { totalPoints, categoryPoints } =
      calculationService.calculateTotalPoints(activities);

    // Count activities by type
    const counts = calculationService.countActivities(activities);

    res.json({
      user: {
        name: user.name,
        title: user.title,
        department: user.department,
        faculty: user.faculty,
        fieldArea: user.fieldArea,
      },
      totalPoints,
      categoryPoints: Object.entries(categoryPoints).map(
        ([category, points]) => ({
          category,
          points,
        })
      ),
      counts,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Verify an activity
// @route   PUT /api/activities/:id/verify
// @access  Private/Admin
exports.verifyActivity = async (req, res) => {
  try {
    const { verificationStatus, verificationNotes } = req.body;

    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Activity not found" });
    }

    activity.verificationStatus = verificationStatus;
    activity.verificationNotes = verificationNotes;

    await activity.save();

    res.json(activity);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};
