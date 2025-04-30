const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");
const roleCheck = require("../middleware/roleCheck");

router.post("/", userController.registerUser);

router.get("/", [auth, roleCheck("admin")], userController.getAllUsers);
router.post("/login", userController.login);
router.get("/me", auth, userController.getMe);
router.get("/verify", auth, userController.verifyToken);

//router.get("/:id", [auth, roleCheck("admin")], userController.getUserById);

//router.put("/profile", auth, userController.updateProfile);

//router.put("/password", auth, userController.updatePassword);

//router.post("/admin", [auth, roleCheck("admin")], userController.createUser);

//router.put("/:id", [auth, roleCheck("admin")], userController.updateUser);

//router.delete("/:id", [auth, roleCheck("admin")], userController.deleteUser);

module.exports = router;
