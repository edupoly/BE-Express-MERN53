var reviewModel = require("./reviews.model");

function getAllReviewsFn(req, res) {
  reviewModel.find().then(function (data) {
    res.send(data);
  });
}

function addNewReviewFn(req, res) {
  console.log(req.body);
  var newReview = new reviewModel(req.body);
  console.log(newReview);
  newReview.save();
  res.send("Aagara babu review add chesta");
}

function updateReviewFn(req, res) {
  console.log(req.body);
  console.log(req.params.id);
  reviewModel
    .findByIdAndUpdate(req.params.id, { $set: req.body })
    .then((data) => {
      res.send("data updated");
    });
}

function deleteReviewFn(req, res) {
  reviewModel.findByIdAndDelete(req.params.id).then((rep) => {
    res.send(rep);
  });
}
module.exports = {
  getAllReviewsFn,
  addNewReviewFn,
  updateReviewFn,
  deleteReviewFn,
};
