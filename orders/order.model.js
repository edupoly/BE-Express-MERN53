const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  // Link them together: The ID of the cart/payment transaction
  groupId: { type: String, required: true },

  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "seller",
    required: true,
  },

  // Flattened Item Details (No Array)
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  quantity: { type: Number, required: true },
  priceAtPurchase: { type: Number, required: true },

  // Costs
  itemTotal: Number, // price * quantity

  status: {
    type: String,
    enum: ["Pending", "Approved", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
  orderDate: { type: Date, default: Date.now },
  deliveryAddress: String,
});

const OrderModel = mongoose.model("order", orderSchema);
module.exports = OrderModel;
