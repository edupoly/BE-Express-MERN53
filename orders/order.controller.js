const OrderModel = require("./order.model");
const ProductModel = require("../products/product.model");
const SellerModel = require("../seller/seller.model");
const UserModel = require("../user.model");

// Customer: Create Order
async function createOrder(req, res) {
  try {
    const { items, deliveryAddress } = req.body; // items: [{productId, quantity}]
    const user = await UserModel.findOne({ username: req.user.username });

    if (!items || items.length === 0) return res.status(400).send("No items");

    // Retrieve product details to get price and seller
    const product = await ProductModel.findById(items[0].productId);
    if (!product) return res.status(404).send("Product not found");

    // NOTE: Simplified logic - Assuming an order contains items from ONLY ONE seller
    // In a complex app, you would split mixed-cart items into multiple orders.
    const sellerId = product.sellerId;
    let totalAmount = 0;

    // Calculate total and formatted items
    const orderItems = [];
    for (let item of items) {
      const p = await ProductModel.findById(item.productId);
      if (p.stock < item.quantity)
        return res.status(400).send(`Insufficient stock for ${p.title}`);

      totalAmount += p.price * item.quantity;
      orderItems.push({
        productId: p._id,
        quantity: item.quantity,
        priceAtPurchase: p.price,
      });
    }

    const newOrder = new OrderModel({
      customerId: user._id,
      sellerId: sellerId,
      items: orderItems,
      totalAmount,
      deliveryAddress,
    });

    await newOrder.save();
    res.send("Order Placed Successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
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

// Get Orders (Generic filter)
async function getOrders(req, res) {
  const { type } = req.query; // 'customer' or 'seller'
  const user = await UserModel.findOne({ username: req.user.username });

  let query = {};
  if (type === "seller") {
    const seller = await SellerModel.findOne({ userId: user._id });
    query.sellerId = seller._id;
  } else {
    query.customerId = user._id;
  }

  // Optional: Filter by specific status via query params ?status=Pending
  if (req.query.status) {
    query.status = req.query.status;
  }

  const orders = await OrderModel.find(query)
    .populate("items.productId")
    .sort({ orderDate: -1 });
  res.send(orders);
}

module.exports = {
  createOrder,
  cancelOrder,
  updateOrderStatus,
  getSellerStats,
  getOrders,
};
