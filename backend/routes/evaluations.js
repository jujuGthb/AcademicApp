const express = require("express")
const router = express.Router()
const evaluationController = require("../controllers/evaluationController")
const auth = require("../middleware/auth")
const roleCheck = require("../middleware/roleCheck")
const upload = require("../middleware/upload")

// @route   GET api/evaluations
// @desc    Get all evaluations
// @access  Private/Admin
router.get("/", [auth, roleCheck("admin", "manager")], evaluationController.getAllEvaluations)

// @route   GET api/evaluations/jury
// @desc    Get evaluations by jury member
// @access  Private/Jury
router.get("/jury", [auth, roleCheck("jury")], evaluationController.getEvaluationsByJury)

// @route   GET api/evaluations/application/:applicationId
// @desc    Get evaluations by application
// @access  Private
router.get("/application/:applicationId", auth, evaluationController.getEvaluationsByApplication)

// @route   GET api/evaluations/stats
// @desc    Get evaluation statistics
// @access  Private/Admin
router.get("/stats", [auth, roleCheck("admin", "manager")], evaluationController.getEvaluationStats)

// @route   GET api/evaluations/:id
// @desc    Get evaluation by ID
// @access  Private
router.get("/:id", auth, evaluationController.getEvaluationById)

// @route   POST api/evaluations
// @desc    Create a new evaluation
// @access  Private/Jury
router.post("/", [auth, roleCheck("jury"), upload.single("report")], evaluationController.createEvaluation)

// @route   PUT api/evaluations/:id
// @desc    Update evaluation
// @access  Private/Jury
router.put("/:id", [auth, roleCheck("jury"), upload.single("report")], evaluationController.updateEvaluation)

// @route   DELETE api/evaluations/:id
// @desc    Delete evaluation
// @access  Private/Admin
router.delete("/:id", [auth, roleCheck("admin")], evaluationController.deleteEvaluation)

// @route   POST api/evaluations/assign
// @desc    Assign jury members to application
// @access  Private/Admin
router.post("/assign", [auth, roleCheck("admin", "manager")], evaluationController.assignJuryMembers)

module.exports = router
