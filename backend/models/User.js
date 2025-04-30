// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const UserSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     role: {
//       type: String,
//       enum: ["admin", "candidate", "reviewer"],
//       default: "candidate",
//     },
//     // Additional fields as needed
//   },
//   { timestamps: true }
// );
// /*
// // Hash password before saving
// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }

//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// // Compare password method
// UserSchema.methods.comparePassword = async function (password) {
//   if (!password) {
//     return false;
//   }

//   try {
//     return await bcrypt.compare(password, this.password);
//   } catch (error) {
//     console.error("Password comparison error:", error);
//     return false;
//   }
// };
// */
// module.exports = mongoose.model("User", UserSchema);

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
