const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

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

module.exports = router;
