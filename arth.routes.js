var express = require("express");
var router = express.Router();

router.get("/add/:n1/:n2", function (req, res) {
  var ans = +req.params.n1 + +req.params.n2;
  res.send(`addition result:: ${ans}`);
});

router.get("/sub/:n1/:n2", function (req, res) {
  var ans = +req.params.n1 - +req.params.n2;
  res.send(`substraction result:: ${ans}`);
});

router.get("/mul/:n1/:n2", function (req, res) {
  var ans = +req.params.n1 * +req.params.n2;
  res.send(`substraction result:: ${ans}`);
});

module.exports = router;
