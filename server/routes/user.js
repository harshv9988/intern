const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");
const { isAuthenticatedUser } = require("../utils/authMiddleware");

router.post("/signup", userController.signupEmail);
router.post("/verify", userController.verify);
router.post("/login", userController.login);
router.get("/me", isAuthenticatedUser, userController.getDetails);

module.exports = router;
