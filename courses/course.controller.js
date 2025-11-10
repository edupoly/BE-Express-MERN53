var CourseModel = require("./course.model");

function getAllCourses(req, res) {
  CourseModel.find().then(function (rep) {
    res.send(rep);
  });
}

function addNewCourse(req, res) {
  var newCourse = new CourseModel(req.body);
  newCourse.save();
  res.send("Course Created");
}

function updateCourseById(req, res) {
  CourseModel.findByIdAndUpdate(req.params.id, req.body).then(function (rep) {
    res.send("Updated Successfully");
  });
}

function deleteCourseById(req, res) {
  CourseModel.findByIdAndDelete(req.params.id).then(function (rep) {
    res.send("Deleted Successfully");
  });
}

module.exports = {
  getAllCourses,
  addNewCourse,
  updateCourseById,
  deleteCourseById,
};
