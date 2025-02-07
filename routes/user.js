// [SECTION] Dependencies and Modules
const express = require("express");
const userController = require("../controllers/user.js");
// Google Login
//const passport = require('passport');
const { verify, verifyAdmin, isLoggedIn } = require("../auth.js")

// [SECTION] Routing Component
const router = express.Router();
// Route for user registration
router.post("/register", userController.registerUser);

// Route for user authentication
router.post("/login", userController.loginUser);

router.get("/details", verify, userController.getProfile);

// Route for user registration
router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.setAsAdmin);

// [SECTION] Route for resetting user password //CHATGPT
router.patch('/update-password', verify, userController.updatePassword);

// [SECTION] Export Route System
module.exports = router;