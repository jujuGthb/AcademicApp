const mongoose = require("mongoose")

const JobPostingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  faculty: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    enum: ["Dr. Öğretim Üyesi", "Doçent", "Profesör"],
    required: true,
  },
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
  description: {
    type: String,
    required: true,
  },
  requiredDocuments: [
    {
      name: String,
      description: String,
      required: Boolean,
    },
  ],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["draft", "published", "closed", "completed"],
    default: "draft",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
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

module.exports = mongoose.model("jobPosting", JobPostingSchema)
