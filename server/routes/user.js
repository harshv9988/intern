const express = require("express");
const router = express.Router();
const path = require("path");

//imports
const userController = require("../controller/userController");
const { isAuthenticatedUser } = require("../utils/authMiddleware");

//multer
// const AVATAR_PATH = path.join("../uploads");
const AVATAR_PATH = path.join(__dirname, "../", "uploads");

const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, AVATAR_PATH);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });

//routes
router.post(
  "/profile",
  isAuthenticatedUser,
  upload.single("profileImg"),
  userController.profileUpload
);

router.post(
  "/cover",
  isAuthenticatedUser,
  upload.single("coverImg"),
  userController.coverUpload
);

router.post("/signup", userController.signupEmail);
router.post("/verify", userController.verify);
router.post("/login", userController.login);
router.get("/me", isAuthenticatedUser, userController.getDetails);

module.exports = router;
