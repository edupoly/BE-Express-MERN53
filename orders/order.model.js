const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
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
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
      quantity: Number,
      priceAtPurchase: Number, // Store price at time of buying
    },
  ],
  totalAmount: Number,
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
