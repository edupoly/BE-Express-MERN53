const express = require("express");
const router = express.Router();
const controller = require("./seller.controller");

// Middleware to check if user is admin (You need to implement/adapt this based on your JWT logic)
const checkAdmin = (req, res, next) => {
  if (req.user.role === "admin") next();
  else res.status(403).send("Admins only");
};

router.post("/promote", checkAdmin, controller.promoteUserToSeller);
router.get("/me", controller.getMySellerProfile);
router.post("/add-product-stock", controller.addProductStock);
router.get("/my-inventory", controller.getMyInventory);

module.exports = router;
