var mongoose = require("mongoose");
// schema create
var studentSchema = mongoose.Schema({
  firstname: String,
  lastname: String,
  place: String,
  age: String,
  gender: String,
});

var studentModel = mongoose.model("student", studentSchema);
module.exports = studentModel;
