const express = require("express");
const router = express.Router();
const controller = require("./order.controller");

// Customer
router.post("/create", controller.createOrder);
router.put("/cancel/:id", controller.cancelOrder);

// Shared (Customer/Seller) - Filtered inside controller based on role
router.get("/list", controller.getOrders);

// Seller
router.put("/update-status/:id", controller.updateOrderStatus);
router.get("/dashboard-stats", controller.getSellerStats);

module.exports = router;
