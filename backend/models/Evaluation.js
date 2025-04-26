const mongoose = require("mongoose")

const EvaluationSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "application",
    required: true,
  },
  juryMember: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  decision: {
    type: String,
    enum: ["positive", "negative", "pending"],
    default: "pending",
  },
  comments: {
    type: String,
  },
  reportPath: {
    type: String,
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

module.exports = mongoose.model("evaluation", EvaluationSchema)
