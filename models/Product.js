const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a product name"],
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
    },
    description: String,
    image: String,
    category: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    stock: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
