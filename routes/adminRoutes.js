const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const Product = require("../models/Product");
const Admin = require("../models/Admin");
const User = require("../models/User");
const Order = require("../models/Order");
const Category = require("../models/Category");

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

// --- Customer Management ---

// @desc    Block/Unblock a customer
// @route   PUT/PATCH /api/admin/customers/:id/block
router.route("/customers/:id/block").put(async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    customer.isBlocked = !customer.isBlocked;
    await customer.save();
    res.json({
      message: `Customer ${customer.isBlocked ? "blocked" : "unblocked"} successfully`,
      customer,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}).patch(async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    customer.isBlocked = !customer.isBlocked;
    await customer.save();
    res.json({
      message: `Customer ${customer.isBlocked ? "blocked" : "unblocked"} successfully`,
      customer,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Get all customers
// @route   GET /api/admin/customers
router.get("/customers", async (req, res) => {
  try {
    const customers = await User.find({}).sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Get customer details and order stats
// @route   GET /api/admin/customers/:id
router.get("/customers/:id", async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const orders = await Order.find({ user: req.params.id });
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((acc, item) => acc + item.totalPrice, 0);
    res.json({
      customer,
      stats: { totalOrders, totalSpent, orders },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Delete a customer
// @route   DELETE /api/admin/customers/:id
router.delete("/customers/:id", async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Customer account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// --- Category Management ---

// @desc    Get all categories for admin
// @route   GET /api/admin/categories
router.get(["/categories", "/allcategories"], async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    console.log(`Fetched ${categories.length} categories from database.`);
    res.json(categories);
  } catch (err) {
    console.error("Fetch Categories Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// @desc    Add a new category
// @route   POST /api/admin/categories
router.post("/categories", upload.single("image"), async (req, res) => {
  try {
    console.log("Create Category Request Body:", req.body);
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Please provide a category name" });
    }

    const categoryExists = await Category.findOne({ name });

    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({
      name,
      image: req.file ? `/uploads/${req.file.filename}` : "",
    });

    res.status(201).json(category);
  } catch (err) {
    console.error("Create Category Error:", err);
    res.status(400).json({ message: err.message });
  }
});

// @desc    Update a category
// @route   PUT /api/admin/categories/:id
router.put("/categories/:id", upload.single("image"), async (req, res) => {
  try {
    console.log(`PUT request received for category ID: ${req.params.id}`);
    const { name } = req.body;
    const updateData = { name };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true },
    );

    if (!updatedCategory) {
      console.log(`Category with ID ${req.params.id} not found in DB.`);
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(updatedCategory);
  } catch (err) {
    console.error("Update Category Error:", err);
    res.status(400).json({ message: err.message });
  }
});

// @desc    Delete a category
// @route   DELETE /api/admin/categories/:id
router.delete("/categories/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Set products in this category to "Uncategorized"
    await Product.updateMany(
      { category: category.name },
      { category: "Uncategorized" },
    );

    await Category.findByIdAndDelete(req.params.id);
    res.json({
      message: "Category deleted and products updated to Uncategorized",
    });
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

// @desc    Admin login
// @route   POST /api/admin/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email }).select("+password");

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Admin register
// @route   POST /api/admin/register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const admin = await Admin.create({
      name,
      email,
      password,
    });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        token: generateToken(admin._id),
      });
    } else {
      res.status(400).json({ message: "Invalid admin data" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

// @desc    Get all orders
// @route   GET /api/admin/orders
router.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @desc    Update order status
// @route   PUT /api/admin/orders/:id/status
router.put("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      if (status === "Delivered") {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
