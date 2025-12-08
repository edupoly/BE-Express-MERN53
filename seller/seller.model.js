const mongoose = require("mongoose");

const sellerSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true, // One user can only have one seller profile
  },
  businessName: String,
  contactEmail: String,
  address: String,
  isApproved: { type: Boolean, default: true },
});

const SellerModel = mongoose.model("seller", sellerSchema);
module.exports = SellerModel;
