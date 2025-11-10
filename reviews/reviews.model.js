var mongoose = require("mongoose");

var reviewSchema = mongoose.Schema({
  username: String,
  feedback: String,
  rating: Number,
  timeStamp: Date,
});

var reviewModel = mongoose.model("review", reviewSchema);
module.exports = reviewModel;
