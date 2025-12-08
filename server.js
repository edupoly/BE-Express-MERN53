var express = require("express");
var app = express();
var mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
var cors = require("cors");

mongoose
  .connect(
    "mongodb+srv://faang:hello123@cluster0.l8nf5yw.mongodb.net/elms?appName=Cluster0"
  )
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
var bodyParser = require("body-parser");

var arthRouter = require("./arth.routes");
var todosRouter = require("./todos/todos.routes");
var studentRouter = require("./student/student.routes");
var reviewRouter = require("./reviews/reviews.routes");
var courseRouter = require("./courses/course.router");
var sellerRouter = require("./seller/seller.routes");
var productRouter = require("./products/product.routes");
var orderRouter = require("./orders/order.routes");
var UserModel = require("./user.model");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/login", function (req, res) {
  UserModel.find(req.body)
    .then(function (rep) {
      if (rep.length == 0) {
        res.send("Wrong Credentials");
      } else {
        var token = jwt.sign(
          { username: rep[0].username, role: rep[0].role },
          "Shh Evariki cheppaku"
        );
        responseObject = {
          token,
          username: rep[0].username,
          role: rep[0].role,
        };
        res.send(responseObject);
      }
    })
    .catch(function (err) {
      console.log("error:", err);
    });
});

function checkAuthentication(req, res, next) {
  try {
    // Assuming your token payload has { username, role }
    var userPayload = jwt.verify(req.headers.token, "Shh Evariki cheppaku");
    req.user = userPayload; // Attach payload to req for controllers to use
    next();
  } catch (e) {
    res.status(401).send("Invalid Token / Not Authenticated");
  }
}
app.use("/arth", arthRouter);
app.use("/todos", checkAuthentication, todosRouter);
app.use("/students", studentRouter);
app.use("/reviews", checkAuthentication, reviewRouter);
app.use("/courses", courseRouter);
// Routes
app.use("/sellers", checkAuthentication, sellerRouter);
app.use("/products", checkAuthentication, productRouter);
// Note: If you want public access to GET products, move getAllProducts route out of checkAuth

app.use("/orders", checkAuthentication, orderRouter);
app.listen(3500);

// http://localhost:3500/add/10/20
// http://localhost:3500/arth/add/10/20
// http://localhost:3500/arth/sub/10/20
