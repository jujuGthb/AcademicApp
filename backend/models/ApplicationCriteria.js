const mongoose = require("mongoose");

// Define the schema for minimum requirements
const MinimumRequirementsSchema = new mongoose.Schema({
  publicationCount: {
    A1A2: { type: Number, default: 0 }, // SCI-E, SSCI, AHCI Q1-Q2
    A1A4: { type: Number, default: 0 }, // SCI-E, SSCI, AHCI all quartiles
    A1A5: { type: Number, default: 0 }, // Including ESCI
    A1A6: { type: Number, default: 0 }, // Including Scopus
    total: { type: Number, default: 0 },
  },
  mainAuthorCount: { type: Number, default: 0 },
  projectCount: { type: Number, default: 0 },
  thesisSupervisionCount: {
    phd: { type: Number, default: 0 },
    masters: { type: Number, default: 0 },
  },
  minimumPoints: {
    A1A4: { type: Number, default: 0 },
    A1A5: { type: Number, default: 0 },
    A1A6: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  exhibitionsCount: {
    personal: { type: Number, default: 0 },
    group: { type: Number, default: 0 },
  },
  patentCount: { type: Number, default: 0 },
});

// Define the schema for special requirements
const SpecialRequirementsSchema = new mongoose.Schema({
  description: { type: String, default: "" },
  requiredPublications: { type: String, default: "" },
  additionalNotes: { type: String, default: "" },
});

// Main ApplicationCriteria schema
const ApplicationCriteriaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    fieldArea: {
      type: String,
      required: true,
    },
    targetTitle: {
      type: String,
      required: true,
      enum: ["Dr. Öğretim Üyesi", "Doçent", "Profesör"],
    },
    isFirstAppointment: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      required: true,
    },
    minimumRequirements: {
      type: MinimumRequirementsSchema,
      default: () => ({}),
    },
    specialRequirements: {
      type: SpecialRequirementsSchema,
      default: () => ({}),
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "ApplicationCriteria",
  ApplicationCriteriaSchema
);
