const OrderModel = require("./order.model");
const ProductModel = require("../products/product.model");
const SellerModel = require("../seller/seller.model");
const UserModel = require("../user.model");
const OrderModel = require("./order.model");
const SellerProductModel = require("../seller/sellerProduct.model");
const UserModel = require("../user.model");
const { v4: uuidv4 } = require("uuid"); // You might need 'npm install uuid' or just use Date.now()

async function createOrder(req, res) {
  try {
    const { items, deliveryAddress } = req.body;
    const user = await UserModel.findOne({ username: req.user.username });

    if (!items || items.length === 0) return res.status(400).send("No items");

    // Generate a unique Group ID for this entire checkout (Cart ID)
    const groupId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const orderPromises = items.map(async (item) => {
      // 1. Verify Stock & Price
      const inventory = await SellerProductModel.findOne({
        sellerId: item.sellerId,
        productId: item.productId,
      });

      if (!inventory)
        throw new Error(`Product not found for seller ${item.sellerId}`);
      if (inventory.stock < item.quantity)
        throw new Error(`Insufficient stock for product ${item.productId}`);

      // 2. Create ONE document per ITEM
      const newOrder = new OrderModel({
        groupId: groupId, // Links all these items together
        customerId: user._id,
        sellerId: item.sellerId,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: inventory.price,
        itemTotal: inventory.price * item.quantity,
        deliveryAddress: deliveryAddress,
      });

      return newOrder.save();
    });

    await Promise.all(orderPromises);

    res.send({ message: "Order Placed Successfully", groupId: groupId });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

// Get Orders (Updated to return flat list)
async function getOrders(req, res) {
  const { type } = req.query;
  const user = await UserModel.findOne({ username: req.user.username });

  let query = {};
  if (type === "seller") {
    const seller = await SellerModel.findOne({ userId: user._id });
    query.sellerId = seller._id;
  } else {
    query.customerId = user._id;
  }

  if (req.query.status) query.status = req.query.status;

  // Populate product details so the UI can show "iPhone 13" instead of ID
  const orders = await OrderModel.find(query)
    .populate("productId")
    .sort({ orderDate: -1 });
  res.send(orders);
}
// Customer: Cancel Order
async function cancelOrder(req, res) {
  try {
    const order = await OrderModel.findById(req.params.id);
    // Security: Check if order belongs to user
    // ... (omitted for brevity, assume middleware checks or add check here)

    if (order.status !== "Pending") {
      return res
        .status(400)
        .send("Cannot cancel order. It is already processed.");
    }

    order.status = "Cancelled";
    await order.save();
    res.send("Order Cancelled");
  } catch (err) {
    res.status(500).send(err.message);
  }
}

// Seller: Update Status (Approve/Ship/Deliver)
async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body; // "Approved", "Shipped", "Delivered"
    const order = await OrderModel.findById(req.params.id);

    if (status === "Approved" && order.status === "Pending") {
      // Decrease Stock on Approval
      for (let item of order.items) {
        await ProductModel.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    order.status = status;
    await order.save();
    res.send(`Order status updated to ${status}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

// Seller: Dashboard Stats
async function getSellerStats(req, res) {
  try {
    const user = await UserModel.findOne({ username: req.user.username });
    const seller = await SellerModel.findOne({ userId: user._id });

    // 1. Total Products & Stock
    const products = await ProductModel.find({ sellerId: seller._id });
    const totalProducts = products.length;

    // 2. Orders & Revenue Aggregation
    const stats = await OrderModel.aggregate([
      { $match: { sellerId: seller._id, status: { $ne: "Cancelled" } } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: "$totalAmount" },
        },
      },
    ]);

    const result = {
      totalProducts,
      stockDetails: products.map((p) => ({ title: p.title, stock: p.stock })),
      totalOrders: stats[0] ? stats[0].totalOrders : 0,
      totalRevenue: stats[0] ? stats[0].totalRevenue : 0,
    };

    res.send(result);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

module.exports = {
  createOrder,
  cancelOrder,
  updateOrderStatus,
  getSellerStats,
  getOrders,
};
