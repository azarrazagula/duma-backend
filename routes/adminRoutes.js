const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");

// Configure Multer for Image Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// @desc    Get all products
// @route   GET /api/admin/allproducts
router.get("/allproducts", async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Add a new product with image
// @route   POST /api/admin/addproducts
router.post("/addproducts", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, category, size, stock } = req.body;
    
    const productData = {
      name,
      price,
      description,
      category,
      size,
      stock,
      image: req.file ? `/uploads/${req.file.filename}` : "", // Save image path
    };

    const product = await Product.create(productData);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Update a product with image
// @route   PUT /api/admin/updateproducts/:id
router.put("/updateproducts/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = { ...req.body };
    
    // Ensure size is handled, it will be inside req.body
    
    // If a new image is uploaded, update the image path
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @desc    Delete a product
// @route   DELETE /api/admin/deleteproducts/:id
router.delete("/deleteproducts/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
