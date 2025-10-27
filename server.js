var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");
var fs = require("fs");
var jwt = require("jsonwebtoken");

app.use(cors());

app.use(express.static(__dirname + "/general"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/login", function (req, res) {
  console.log(req.body);
  //ofcourse we should check but now leave it
  var token = jwt.sign(req.body, "shhh gupchup");
  res.send({ token, username: req.body.username });
});

const checklist = [authenticate, authorize1];
//end points // routes

//request handling
app.get("/addTodo", function (req, res) {
  console.log(req.query);
  res.send("Cheddam undu");
});

function checkToken(req, res, next) {
  console.log(req.headers);
  if (req.headers?.token) {
    var d = jwt.verify(req.headers.token, "shhh gupchup");
    if (d) {
      next();
    } else {
      res.send({ msg: "invalid" });
    }
  } else {
    res.send({ msg: "invalid" });
  }
}

app.get("/getAllTodos", checkToken, function (req, res) {
  var f1 = JSON.parse(fs.readFileSync("todos.txt").toString());
  res.json(f1);
});

app.get("/getTodosByUserName/:username", checkToken, function (req, res) {
  var f1 = JSON.parse(fs.readFileSync("todos.txt").toString());
  var filteredData = f1.filter(function (todo) {
    if (todo.username === req.params.username) {
      return true;
    }
  });
  res.json(filteredData);
});

function authenticate(req, res, next) {
  //edo logic
  console.log("Authentication jarigindi");
  next();
}
function authorize1(req, res, next) {
  console.log("authorize1");
  next();
}
app.get("/getMovieById/:m1", checklist, function (req, res) {
  res.send("Idigo thesuko");
});

app.post("/addTodo", function (req, res) {
  console.log(req.body);
  var f1 = JSON.parse(fs.readFileSync("todos.txt").toString());
  f1.push(req.body);
  fs.writeFileSync("todos.txt", JSON.stringify(f1));
  res.send("Orey Ajaamu lagetthu");
});

app.get("/add", function (req, res) {
  res.send("add cheseddam");
});

app.get("/add/:a/:b", function (req, res) {
  console.log(req.params);
  res.send(req.params.a + req.params.b);
});

app.get("/mul", function (req, res) {
  res.send("mul cheddamaaaaa");
});

app.listen(3500);

// REST API()//SOAP
// API's
// endpoints
