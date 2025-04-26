const mongoose = require("mongoose")

const ApplicationSchema = new mongoose.Schema({
  jobPosting: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "jobPosting",
    required: true,
  },
  candidate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "under_review", "approved", "rejected"],
    default: "pending",
  },
  documents: [
    {
      name: String,
      path: String,
      uploadDate: {
        type: Date,
        default: Date.now,
      },
      category: String,
      verified: {
        type: Boolean,
        default: false,
      },
    },
  ],
  activities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "activity",
    },
  ],
  report: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "report",
  },
  totalPoints: {
    type: Number,
    default: 0,
  },
  categoryPoints: {
    A: { type: Number, default: 0 },
    B: { type: Number, default: 0 },
    C: { type: Number, default: 0 },
    D: { type: Number, default: 0 },
    E: { type: Number, default: 0 },
    F: { type: Number, default: 0 },
    G: { type: Number, default: 0 },
    H: { type: Number, default: 0 },
    I: { type: Number, default: 0 },
    J: { type: Number, default: 0 },
    K: { type: Number, default: 0 },
    L: { type: Number, default: 0 },
  },
  activityCounts: {
    publications: { type: Number, default: 0 },
    mainAuthor: { type: Number, default: 0 },
    projects: { type: Number, default: 0 },
    theses: { type: Number, default: 0 },
    sciPublications: { type: Number, default: 0 },
    internationalPublications: { type: Number, default: 0 },
    nationalPublications: { type: Number, default: 0 },
    personalExhibitions: { type: Number, default: 0 },
    groupExhibitions: { type: Number, default: 0 },
  },
  submittedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

module.exports = mongoose.model("application", ApplicationSchema)
