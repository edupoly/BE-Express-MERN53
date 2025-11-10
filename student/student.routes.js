var express = require("express");
var router = express.Router();
var studentModel = require("./student.model");

router.get("/getAllStudents", (req, res) => {
  studentModel.find().then((data) => {
    console.log(data);
    res.send(data);
  });
});

module.exports = router;
