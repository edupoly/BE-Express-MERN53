const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  discountPercentage: Number,
  stock: { type: Number, required: true },
  brand: String,
  category: String,
  thumbnail: String,
  images: [String],
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "seller",
    required: true,
  },
});

const ProductModel = mongoose.model("product", productSchema);
module.exports = ProductModel;
