const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const Activity = require("../models/Activity");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");
const config = require("../config/config");

// @route   GET api/activities
// @desc    Get all activities for a user
// @access  Private
router.get("/", auth, async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// @route   POST api/activities
// @desc    Create an activity
// @access  Private
router.post("/", auth, upload.array("attachments", 5), async (req, res) => {
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
    let calculatedPoints = Number.parseFloat(basePoints);

    // Apply author count multiplier
    if (authorCount > 1) {
      if (authorCount === 2) {
        calculatedPoints *= 0.8;
      } else if (authorCount === 3) {
        calculatedPoints *= 0.6;
      } else if (authorCount === 4) {
        calculatedPoints *= 0.5;
      } else if (authorCount >= 5 && authorCount <= 9) {
        calculatedPoints *= 1 / authorCount;
      } else if (authorCount >= 10) {
        calculatedPoints *= 0.1;
      }
    }

    // Apply main author bonus for 5+ authors
    if (authorCount >= 5 && isMainAuthor === "true") {
      calculatedPoints *= 1.8;
    }

    // Process file attachments
    const attachments = req.files.map((file) => ({
      name: file.originalname,
      path: file.path.replace(/\\/g, "/"), // Normalize path for all OS
    }));

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
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// @route   GET api/activities/:id
// @desc    Get activity by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Faaliyet bulunamadı" });
    }

    // Check if user owns the activity
    if (activity.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Yetkilendirme reddedildi" });
    }

    res.json(activity);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// @route   PUT api/activities/:id
// @desc    Update an activity
// @access  Private
router.put("/:id", auth, upload.array("attachments", 5), async (req, res) => {
  try {
    let activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Faaliyet bulunamadı" });
    }

    // Check if user owns the activity
    if (activity.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Yetkilendirme reddedildi" });
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
    let calculatedPoints = Number.parseFloat(basePoints);

    // Apply author count multiplier
    if (authorCount > 1) {
      if (authorCount === 2) {
        calculatedPoints *= 0.8;
      } else if (authorCount === 3) {
        calculatedPoints *= 0.6;
      } else if (authorCount === 4) {
        calculatedPoints *= 0.5;
      } else if (authorCount >= 5 && authorCount <= 9) {
        calculatedPoints *= 1 / authorCount;
      } else if (authorCount >= 10) {
        calculatedPoints *= 0.1;
      }
    }

    // Apply main author bonus for 5+ authors
    if (authorCount >= 5 && isMainAuthor === "true") {
      calculatedPoints *= 1.8;
    }

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
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// @route   DELETE api/activities/:id
// @desc    Delete an activity
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Faaliyet bulunamadı" });
    }

    // Check if user owns the activity
    if (activity.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "Yetkilendirme reddedildi" });
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
    res.json({ message: "Faaliyet silindi" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// @route   GET api/activities/category/:category
// @desc    Get activities by category
// @access  Private
router.get("/category/:category", auth, async (req, res) => {
  try {
    const activities = await Activity.find({
      user: req.user.id,
      category: req.params.category,
    }).sort({ date: -1 });

    res.json(activities);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

// @route   GET api/activities/stats/summary
// @desc    Get activity statistics
// @access  Private
router.get("/stats/summary", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Get total points by category
    const categoryStats = await Activity.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $group: {
          _id: "$category",
          totalPoints: { $sum: "$calculatedPoints" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get publication counts
    const publicationCount = await Activity.countDocuments({
      user: req.user.id,
      category: "A",
    });

    // Get main author publication counts
    const mainAuthorCount = await Activity.countDocuments({
      user: req.user.id,
      category: "A",
      isMainAuthor: true,
    });

    // Get project counts
    const projectCount = await Activity.countDocuments({
      user: req.user.id,
      category: "H",
    });

    // Get thesis supervision counts
    const thesisCount = await Activity.countDocuments({
      user: req.user.id,
      category: "F",
    });

    // Get SCI/SSCI/AHCI publication counts
    const sciPublicationCount = await Activity.countDocuments({
      user: req.user.id,
      category: "A",
      indexType: { $in: ["SCI-E", "SSCI", "AHCI"] },
    });

    // Get personal and group exhibition counts for arts
    const personalExhibitionCount = await Activity.countDocuments({
      user: req.user.id,
      category: "L",
      subcategory: { $in: ["L.5", "L.6"] },
    });

    const groupExhibitionCount = await Activity.countDocuments({
      user: req.user.id,
      category: "L",
      subcategory: { $in: ["L.7", "L.8"] },
    });

    res.json({
      user: {
        name: user.name,
        title: user.title,
        department: user.department,
        faculty: user.faculty,
        fieldArea: user.fieldArea,
      },
      categoryStats,
      counts: {
        publications: publicationCount,
        mainAuthor: mainAuthorCount,
        projects: projectCount,
        theses: thesisCount,
        sciPublications: sciPublicationCount,
        personalExhibitions: personalExhibitionCount,
        groupExhibitions: groupExhibitionCount,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Sunucu hatası" });
  }
});

module.exports = router;
