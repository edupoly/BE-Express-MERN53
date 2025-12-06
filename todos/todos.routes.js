var express = require("express");
var router = express.Router();
var funs = require("./todos.controller");

router.get("/getAllTodos", funs.getTodos);
router.get("/getTodosByUserName/:username", funs.getTodosByUserName);
router.post("/addNewTodo", funs.addTodo);
module.exports = router;
