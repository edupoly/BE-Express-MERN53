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
// 1. SIGNUP ENDPOINT (Create new user in MongoDB)
app.post("/signup", async function (req, res) {
  try {
    // Check if user already exists
    const existingUser = await UserModel.findOne({
      username: req.body.username,
    });
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }

    // Create new user
    // req.body should contain { username, password, role }
    // Default role to 'customer' if not provided, or handle as needed
    const newUser = new UserModel(req.body);
    await newUser.save();

    res.send("Signup Successful");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error creating user");
  }
});

// 2. LOGIN ENDPOINT (Verify user from MongoDB)
// (This replaces or updates your existing /login to be more robust)
app.post("/login", async function (req, res) {
  try {
    const { username, password } = req.body;

    // Find user by username AND password
    // Note: In production, you should hash passwords (e.g., using bcrypt)
    // instead of storing them as plain text.
    const user = await UserModel.findOne({ username, password });

    if (user) {
      var token = jwt.sign(
        { username: user.username, role: user.role, _id: user._id },
        "Shh Evariki cheppaku"
      );
      res.send({
        token,
        username: user.username,
        role: user.role,
        _id: user._id,
      });
    } else {
      res.status(401).send("Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Login Error");
  }
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
app.listen(3500, () => {
  console.log("server running 3500");
});

// http://localhost:3500/add/10/20
// http://localhost:3500/arth/add/10/20
// http://localhost:3500/arth/sub/10/20
