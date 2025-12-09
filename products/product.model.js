const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  brand: String,
  category: String,
  thumbnail: String,
  images: [String],
  refPrice: Number, // MSRP or general reference price
});

const ProductModel = mongoose.model("product", productSchema);
module.exports = ProductModel;
