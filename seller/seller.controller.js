const SellerModel = require("./seller.model");
const UserModel = require("../user.model"); // Citing existing user.model.js
const SellerProductModel = require("./sellerProduct.model");

// Admin: Promote a user to Seller
async function promoteUserToSeller(req, res) {
  try {
    const { userId, businessName, address } = req.body;

    // 1. Check if seller profile exists
    const existingSeller = await SellerModel.findOne({ userId });
    if (existingSeller) return res.status(400).send("User is already a seller");

    // 2. Create Seller Profile
    const newSeller = new SellerModel({ userId, businessName, address });
    await newSeller.save();

    // 3. Update User Role
    await UserModel.findByIdAndUpdate(userId, { role: "seller" });

    res.send("User promoted to Seller successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
}

async function getMySellerProfile(req, res) {
  // Assuming req.user is set by your checkAuthentication middleware
  try {
    const user = await UserModel.findOne({ username: req.user.username });
    const seller = await SellerModel.findOne({ userId: user._id });
    res.send(seller);
  } catch (err) {
    res.status(500).send("Error fetching profile");
  }
}
// Seller: Add stock for a product (List an item)
async function addProductStock(req, res) {
  try {
    const { productId, price, stock, discountPercentage } = req.body;

    // Get logged in seller
    const user = await UserModel.findOne({ username: req.user.username });
    const seller = await SellerModel.findOne({ userId: user._id });
    if (!seller) return res.status(403).send("Seller not found");

    // Upsert: Update if exists, Create if not
    await SellerProductModel.findOneAndUpdate(
      { sellerId: seller._id, productId: productId },
      {
        $set: { price, stock, discountPercentage, isActive: true },
      },
      { upsert: true, new: true }
    );

    res.send("Inventory Updated Successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
}
// Seller: Get my inventory
async function getMyInventory(req, res) {
  try {
    const user = await UserModel.findOne({ username: req.user.username });
    const seller = await SellerModel.findOne({ userId: user._id });

    const inventory = await SellerProductModel.find({
      sellerId: seller._id,
    }).populate("productId"); // Get details from Catalog
    res.send(inventory);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
module.exports = {
  promoteUserToSeller,
  getMySellerProfile,
  addProductStock,
  getMyInventory,
};
