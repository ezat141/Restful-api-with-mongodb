const express = require("express");

const router = express.Router();
const appError = require("../utils/appError");

const multer = require("multer");

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const fileName = `user-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const imageType = file.mimetype.split("/")[0];
  if (imageType === "image") {
    return cb(null, true);
  } else {
    return cb(appError.create("file must be an image", 400), false);
  }
};

const upload = multer({
  storage: diskStorage,
  fileFilter: fileFilter,
});

const usersController = require("../controllers/userController");
const verifyToken = require("../middleware/verfiyToken");

// get all users

// register

// login

router.route("/").get(verifyToken, usersController.getAllUsers);

router
  .route("/register")
  .post(upload.single("avatar"), usersController.registerUser);

router.route("/login").post(usersController.loginUser);

module.exports = router;
