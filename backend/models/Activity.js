const mongoose = require("mongoose");
const User = require("./User");

const ActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: {
    type: String,
    enum: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"],
    required: true,
  },
  subcategory: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  authors: {
    type: String,
  },
  authorCount: {
    type: Number,
    default: 1,
  },
  isMainAuthor: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    required: true,
  },
  journal: {
    type: String,
  },
  volume: {
    type: String,
  },
  issue: {
    type: String,
  },
  pages: {
    type: String,
  },
  doi: {
    type: String,
  },
  indexType: {
    type: String,
    enum: [
      "SCI-E",
      "SSCI",
      "AHCI",
      "ESCI",
      "Scopus",
      "TR Dizin",
      "Diğer Uluslararası",
      "Diğer Ulusal",
      "",
    ],
  },
  quartile: {
    type: String,
    enum: ["Q1", "Q2", "Q3", "Q4", ""],
  },
  basePoints: {
    type: Number,
    required: true,
  },
  calculatedPoints: {
    type: Number,
    required: true,
  },
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
  verificationStatus: {
    type: String,
    enum: ["pending", "verified", "rejected"],
    default: "pending",
  },
  verificationNotes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("activity", ActivitySchema);
