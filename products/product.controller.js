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

// Public: Get a single product details with list of Sellers selling it
async function getProductDetails(req, res) {
  try {
    const product = await ProductModel.findById(req.params.id);
    // Find all sellers selling this product
    const sellers = await SellerProductModel.find({
      productId: product._id,
      stock: { $gt: 0 },
    }).populate("sellerId", "businessName");

    res.json({ product, availableSellers: sellers });
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
// Admin/Seller: Create a new Catalog Item (Master Product)
async function createMasterProduct(req, res) {
  try {
    const newProduct = new ProductModel(req.body);
    await newProduct.save();
    res.send("Master Product Created in Catalog");
  } catch (err) {
    res.status(500).send(err.message);
  }
}
module.exports = {
  getAllProducts,
  getMyProducts,
  getProductDetails,
  createMasterProduct,
};
