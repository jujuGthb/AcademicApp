

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
      unique: false,
    },
    password: {
      type: String,
      required: true,
    },
    tcNumber: {
      type: String,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "jury", "applicant"],
      default: "applicant",
    },
    // Additional fields as needed
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
