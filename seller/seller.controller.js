const SellerModel = require("./seller.model");
const UserModel = require("../user.model"); // Citing existing user.model.js

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

module.exports = { promoteUserToSeller, getMySellerProfile };
