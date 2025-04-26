const User = require("../models/User")
const jwt = require("jsonwebtoken")
const config = require("../config/config")

// @desc    Register user
// @route   POST /api/users
// @access  Public
exports.registerUser = async (req, res) => {
  const { name, email, password, title, department, faculty, fieldArea, doctorateDate, lastPromotionDate } = req.body

  try {
    // Check if user exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      title,
      department,
      faculty,
      fieldArea,
      doctorateDate: doctorateDate ? new Date(doctorateDate) : null,
      lastPromotionDate: lastPromotionDate ? new Date(lastPromotionDate) : null,
    })

    // Save user to database
    await user.save()

    // Create JWT payload
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    }

    // Sign token
    jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiration }, (err, token) => {
      if (err) throw err
      res.json({ token })
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(user)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  const { name, title, department, faculty, fieldArea, doctorateDate, lastPromotionDate } = req.body

  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update fields
    if (name) user.name = name
    if (title) user.title = title
    if (department) user.department = department
    if (faculty) user.faculty = faculty
    if (fieldArea) user.fieldArea = fieldArea
    if (doctorateDate) user.doctorateDate = new Date(doctorateDate)
    if (lastPromotionDate) user.lastPromotionDate = new Date(lastPromotionDate)

    await user.save()

    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Update user password
// @route   PUT /api/users/password
// @access  Private
exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body

  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" })
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({ message: "Password updated successfully" })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Create new user (admin only)
// @route   POST /api/users/admin
// @access  Private/Admin
exports.createUser = async (req, res) => {
  const { name, email, password, role, title, department, faculty, fieldArea } = req.body

  try {
    // Check if user exists
    let user = await User.findOne({ email })
    if (user) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      role,
      title,
      department,
      faculty,
      fieldArea,
    })

    // Save user to database
    await user.save()

    res.json(user)
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Update user (admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  const { name, email, role, title, department, faculty, fieldArea, password } = req.body

  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update fields
    if (name) user.name = name
    if (email) user.email = email
    if (role) user.role = role
    if (title) user.title = title
    if (department) user.department = department
    if (faculty) user.faculty = faculty
    if (fieldArea) user.fieldArea = fieldArea
    if (password) user.password = password

    await user.save()

    res.json(user)
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(500).json({ message: "Server error" })
  }
}

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    await user.remove()

    res.json({ message: "User removed" })
  } catch (err) {
    console.error(err.message)
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "User not found" })
    }
    res.status(500).json({ message: "Server error" })
  }
}
