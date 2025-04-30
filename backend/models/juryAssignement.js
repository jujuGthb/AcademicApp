const mongoose = require("mongoose");

const JuryAssignmentSchema = new mongoose.Schema(
  {
    jobPosting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPosting",
      required: true,
    },
    application: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    juryMember: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending",
    },
    dueDate: {
      type: Date,
      required: true,
    },
    completedDate: {
      type: Date,
    },
    evaluation: {
      decision: {
        type: String,
        enum: ["positive", "negative"],
      },
      comments: String,
      reportUrl: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JuryAssignment", JuryAssignmentSchema);
