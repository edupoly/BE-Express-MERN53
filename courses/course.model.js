var mongoose = require("mongoose");

var courseSchema = mongoose.Schema({
  courseName: String,
  coursePrice: Number,
  courseDuration: Number,
  courseDescription: String,
  courseThumbnail: String,
});

var CourseModel = mongoose.model("course", courseSchema);
module.exports = CourseModel;
