var express = require("express");
var router = express.Router();
var funs = require("./todos.controller");

router.get("/getAllTodos", funs.getTodos);

module.exports = router;
