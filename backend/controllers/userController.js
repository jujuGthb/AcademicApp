const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const bcrypt = require("bcryptjs");

// @desc    Register user
// @route   POST /api/users
// @access  Public
exports.registerUser = async (req, res) => {
  const {
    name,
    tcNumber,
    password,
    title,
    department,
    faculty,
    fieldArea,
    doctorateDate,
    lastPromotionDate,
  } = req.body;

  const hash = await bcrypt.hash(password, 10);

  try {
    // Check if user exists
    let user = await User.findOne({ tcNumber });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    user = new User({
      name,
      tcNumber,
      password: hash,
      title,
      department,
      faculty,
      fieldArea,
      doctorateDate: doctorateDate ? new Date(doctorateDate) : null,
      lastPromotionDate: lastPromotionDate ? new Date(lastPromotionDate) : null,
    });

    // Save user to database
    await user.save();

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    // Sign token
    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: config.jwtExpiration },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// The rest remains mostly the same, except for places using "email":

exports.createUser = async (req, res) => {
  const {
    name,
    tcNumber,
    password,
    role,
    title,
    department,
    faculty,
    fieldArea,
  } = req.body;

  //console.log("ok");

  try {
    // Check if user exists
    let user = await User.findOne({ tcNumber });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    user = new User({
      name,
      tcNumber,
      password,
      role,
      title,
      department,
      faculty,
      fieldArea,
    });

    await user.save();
    //console.log(user);

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUser = async (req, res) => {
  const {
    name,
    tcNumber,
    role,
    title,
    department,
    faculty,
    fieldArea,
    password,
  } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    if (name) user.name = name;
    if (tcNumber) user.tcNumber = tcNumber;
    if (role) user.role = role;
    if (title) user.title = title;
    if (department) user.department = department;
    if (faculty) user.faculty = faculty;
    if (fieldArea) user.fieldArea = fieldArea;
    if (password) user.password = password;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllUsers = (res, req, next) => {
  try {
    const users = User.find();
    return res.status(200).json({ message: "success", users: users });
  } catch (error) {
    console.log("error users not found");
    return res.status(200).json({ message: "success", users: users });
  }
};

exports.login = async (req, res) => {
  let { password, tcNumber } = req.body;
  console.log(req.body);

  try {
    // Ensure tcNumber is provided
    if (!tcNumber) {
      return res.status(400).json({ message: "TC number is required" });
    }

    // Find user by TC number
    let user = await User.findOne({ tcNumber });
    //console.log(user);

    // If no user found or password is empty
    if (!user || !password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password.toString(), user.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: "Passord does not match." });
    }

    // Create JWT payload with user role
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    // Sign token
    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: config.jwtExpiration },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: user,
        });
      }
    );
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { name, password, tcNumber, role } = req.body;

  try {
    // Check if TC number is already in use
    let user = await User.findOne({ tcNumber });
    if (user) {
      return res.status(400).json({ message: "TC number already in use" });
    }

    // Create new user
    user = new User({
      name,
      password,
      tcNumber,
      // Only allow setting role to applicant during registration
      // Other roles must be assigned by an admin
      role: "applicant",
    });

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    // Sign token
    jwt.sign(
      payload,
      config.jwtSecret,
      { expiresIn: config.jwtExpiration },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            tcNumber: user.tcNumber, // Provide tcNumber instead of email
            role: user.role,
          },
        });
      }
    );
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Verify token
// @route   GET /api/auth/verify
// @access  Private
exports.verifyToken = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update user role (admin only)
// @route   PATCH /api/auth/users/:id/role
// @access  Private (Admin only)
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Validate role
    if (!["admin", "manager", "jury", "applicant"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.json({
      message: "User role updated",
      user: { id: user.id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
};
