const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

const { validationSchema } = require("../middleware/validationSchema");
const verifyToken = require("../middleware/verfiyToken");
const allowedTo = require("../middleware/allowedTo");
const { userRoles } = require("../utils/userRoles");

// Routes
router
  .route("/")
  .get(courseController.getAllCourses)
  .post(verifyToken, allowedTo(userRoles.MANGER), validationSchema(), courseController.addCourse);

router
  .route("/:courseId")
  .get(courseController.getCourse)
  .patch(courseController.updateCourse)
  .delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANGER), courseController.deleteCourse);

module.exports = router;
