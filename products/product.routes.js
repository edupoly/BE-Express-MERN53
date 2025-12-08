const express = require("express");
const router = express.Router();
const controller = require("./product.controller");

// Public
router.get("/", controller.getAllProducts);

// Seller Only
router.post("/add", controller.addProduct); // Auth middleware is in server.js
router.get("/my-products", controller.getMyProducts);

module.exports = router;
