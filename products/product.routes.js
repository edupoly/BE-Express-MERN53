const express = require("express");
const router = express.Router();
const controller = require("./product.controller");

// Public
router.get("/", controller.getAllProducts);

// Seller Only
router.get("/my-products", controller.getMyProducts);

module.exports = router;
