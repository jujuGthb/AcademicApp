const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");
const juryController = require("../controllers/juryController");

// @route   POST /api/jury/assign
// @desc    Assign jury members to an application
// @access  Private (Manager only)
router.post(
  "/assign",
  [auth, roleCheck("manager")],
  juryController.assignJuryMembers
);

// @route   GET /api/jury/assignments/:applicationId
// @desc    Get jury assignments for a specific application
// @access  Private (Manager only)
router.get(
  "/assignments/:applicationId",
  [auth, roleCheck("manager")],
  juryController.getJuryAssignmentsByApplication
);

// @route   GET /api/jury/members
// @desc    Get all jury members
// @access  Private (Manager only)
router.get(
  "/members",
  [auth, roleCheck("manager")],
  juryController.getAllJuryMembers
);

// @route   POST /api/jury/decision/:applicationId
// @desc    Make final decision on application
// @access  Private (Manager only)
router.post(
  "/decision/:applicationId",
  [auth, roleCheck("manager")],
  juryController.makeFinalDecision
);

// @route   GET /api/jury/statistics
// @desc    Get application statistics
// @access  Private (Manager only)
router.get(
  "/statistics",
  [auth, roleCheck("manager")],
  juryController.getApplicationStatistics
);

module.exports = router;
