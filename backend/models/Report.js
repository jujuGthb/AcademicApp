const mongoose = require("mongoose")

const ReportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  targetTitle: {
    type: String,
    enum: ["Dr. Öğretim Üyesi", "Doçent", "Profesör"],
    required: true,
  },
  isFirstAppointment: {
    type: Boolean,
    default: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  totalPoints: {
    type: Number,
    required: true,
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
  activities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "activity",
    },
  ],
  attachments: [
    {
      name: String,
      path: String,
      uploadDate: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  status: {
    type: String,
    enum: ["draft", "submitted", "under_review", "approved", "rejected"],
    default: "draft",
  },
  reviewNotes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  submittedAt: {
    type: Date,
  },
})

module.exports = mongoose.model("report", ReportSchema)
