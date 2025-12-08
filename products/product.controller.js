const ProductModel = require("./product.model");
const SellerModel = require("../seller/seller.model");
const UserModel = require("../user.model");

// Public: Get all products
async function getAllProducts(req, res) {
  try {
    const products = await ProductModel.find().populate(
      "sellerId",
      "businessName"
    );
    res.send(products);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

// Seller: Add new product
async function addProduct(req, res) {
  try {
    // 1. Find the seller ID associated with the logged-in user
    const user = await UserModel.findOne({ username: req.user.username });
    const seller = await SellerModel.findOne({ userId: user._id });

    if (!seller) return res.status(403).send("You are not a registered seller");

    // 2. Create Product linked to this seller
    const newProduct = new ProductModel({
      ...req.body,
      sellerId: seller._id,
    });

    await newProduct.save();
    res.send("Product Added Successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
}

// Seller: Get only their products
async function getMyProducts(req, res) {
  try {
    const user = await UserModel.findOne({ username: req.user.username });
    const seller = await SellerModel.findOne({ userId: user._id });
    if (!seller) return res.status(404).send("Seller profile not found");

    const products = await ProductModel.find({ sellerId: seller._id });
    res.send(products);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

module.exports = { getAllProducts, addProduct, getMyProducts };
