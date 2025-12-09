const mongoose = require("mongoose");

const sellerProductSchema = mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "seller",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "product",
    required: true,
  },
  stock: { type: Number, required: true, default: 0 },
  price: { type: Number, required: true }, // Seller's specific price
  discountPercentage: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

// Compound index to ensure a seller can't add the same product twice
sellerProductSchema.index({ sellerId: 1, productId: 1 }, { unique: true });

const SellerProductModel = mongoose.model(
  "seller_product",
  sellerProductSchema
);
module.exports = SellerProductModel;
