var express = require("express");
const {
  getAllCourses,
  addNewCourse,
  updateCourseById,
  deleteCourseById,
} = require("./course.controller");
var router = express.Router();

router.get("/getAllCourses", getAllCourses);
router.post("/addNewCourse", addNewCourse);
router.put("/updateCourseById/:id", updateCourseById);
router.delete("/deleteCourseById/:id", deleteCourseById);

module.exports = router;
