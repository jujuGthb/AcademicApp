const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  name: String,
  description: String,
  fileUrl: String,
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const PublicationSchema = new mongoose.Schema({
  title: String,
  journal: String,
  year: Number,
  category: {
    type: String,
    enum: [
      "A1",
      "A2",
      "A3",
      "A4",
      "A5",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
    ],
  },
  isMainAuthor: {
    type: Boolean,
    default: false,
  },
  points: Number,
  fileUrl: String,
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const CitationSchema = new mongoose.Schema({
  title: String,
  source: String,
  year: Number,
  points: Number,
  fileUrl: String,
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const ApplicationSchema = new mongoose.Schema(
  {
    jobPosting: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPosting",
      required: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    documents: [DocumentSchema],
    publications: [PublicationSchema],
    citations: [CitationSchema],
    totalPoints: {
      type: Number,
      default: 0,
    },
    categoryPoints: {
      A1: { type: Number, default: 0 },
      A2: { type: Number, default: 0 },
      A3: { type: Number, default: 0 },
      A4: { type: Number, default: 0 },
      A5: { type: Number, default: 0 },
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
    status: {
      type: String,
      enum: ["draft", "submitted", "under_review", "approved", "rejected"],
      default: "draft",
    },
    submissionDate: {
      type: Date,
    },
    juryMembers: [
      {
        juryMember: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["pending", "in_progress", "completed"],
          default: "pending",
        },
        evaluation: {
          decision: {
            type: String,
            enum: ["positive", "negative"],
          },
          comments: String,
          reportUrl: String,
          submissionDate: Date,
        },
      },
    ],
    finalDecision: {
      decision: {
        type: String,
        enum: ["approved", "rejected"],
      },
      comments: String,
      decisionDate: Date,
      decidedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", ApplicationSchema);
