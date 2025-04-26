const mongoose = require("mongoose")

const CriteriaSchema = new mongoose.Schema({
  fieldArea: {
    type: String,
    enum: [
      "Sağlık Bilimleri",
      "Fen Bilimleri ve Matematik",
      "Mühendislik",
      "Ziraat, Orman ve Su Ürünleri",
      "Eğitim Bilimleri",
      "Filoloji",
      "Mimarlık, Planlama ve Tasarım",
      "Sosyal, Beşeri ve İdari Bilimler",
      "Spor Bilimleri",
      "Hukuk",
      "İlahiyat",
      "Güzel Sanatlar",
    ],
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
  minimumRequirements: {
    totalPoints: { type: Number, required: true },
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
  },
  maximumLimits: {
    categoryPoints: {
      D: { type: Number, default: 1500 },
      E: { type: Number, default: 50 },
      K: { type: Number, default: 50 },
    },
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

module.exports = mongoose.model("criteria", CriteriaSchema)
