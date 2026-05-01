const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");
const Category = require("../models/Category");

// @desc    Get all categories for users
// @route   GET /api/user/categories
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/user/register
router.post("/register", async (req, res) => {
  const { name, email, mobile, password } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      mobile,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/user/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.matchPassword(password))) {
      if (user.isBlocked) {
        return res
          .status(403)
          .json({ message: "Your account has been blocked. Please contact support." });
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Get all products for users
// @route   GET /api/user/products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Create new order
// @route   POST /api/user/orders
router.post("/orders", protect, async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: "No order items" });
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    try {
      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
});

// @desc    Get logged in user orders
// @route   GET /api/user/orders/my-orders
router.get("/orders/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
