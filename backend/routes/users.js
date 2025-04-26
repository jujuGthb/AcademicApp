const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")
const auth = require("../middleware/auth")
const roleCheck = require("../middleware/roleCheck")

// @route   POST api/users
// @desc    Register user
// @access  Public
router.post("/", userController.registerUser)

// @route   GET api/users
// @desc    Get all users
// @access  Private/Admin
router.get("/", [auth, roleCheck("admin")], userController.getAllUsers)

// @route   GET api/users/:id
// @desc    Get user by ID
// @access  Private/Admin
router.get("/:id", [auth, roleCheck("admin")], userController.getUserById)

// @route   PUT api/users/profile
// @desc    Update user profile
// @access  Private
router.put("/profile", auth, userController.updateProfile)

// @route   PUT api/users/password
// @desc    Update user password
// @access  Private
router.put("/password", auth, userController.updatePassword)

// @route   POST api/users/admin
// @desc    Create new user (admin only)
// @access  Private/Admin
router.post("/admin", [auth, roleCheck("admin")], userController.createUser)

// @route   PUT api/users/:id
// @desc    Update user (admin only)
// @access  Private/Admin
router.put("/:id", [auth, roleCheck("admin")], userController.updateUser)

// @route   DELETE api/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete("/:id", [auth, roleCheck("admin")], userController.deleteUser)

module.exports = router
