var express = require("express");
var router = express.Router();
var reviewModel = require("./reviews.model");
var jwt = require("jsonwebtoken");
const {
  getAllReviewsFn,
  addNewReviewFn,
  updateReviewFn,
  deleteReviewFn,
} = require("./reviews.controller");

function checkAuthorisation(req, res, next) {
  try {
    var x = jwt.verify(req.headers.token, "Shh Evariki cheppaku");
    if (x.role === "admin") {
      next();
    } else {
      res.send("Neeku antha cinema ledu");
    }
  } catch (e) {
    console.log("Exception vachindi::", e);
    res.send("nijamena wrong credentials", e);
  }
}

router.get("/getAllReviews", getAllReviewsFn);

router.post("/addNewReview", checkAuthorisation, addNewReviewFn);

//edit or update
router.put("/updateReview/:id", updateReviewFn);

//delete
router.delete("/deleteReview/:id", deleteReviewFn);

module.exports = router;
