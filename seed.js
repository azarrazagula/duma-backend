require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB for seeding...'))
    .catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });

// Product Schema (Must match index.js)
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: String,
    image: String,
    category: String,
    stock: { type: Number, default: 0 }
});

const Product = mongoose.model('Product', productSchema);

// Data from your App.js
const T_Shirts = [
    { name: "Crimson Rush", price: 49.99, description: "Deep red premium texture for the bold.", category: "T-Shirt" },
    { name: "Ocean Breeze", price: 54.99, description: "Calming blue tones for a modern look.", category: "T-Shirt" },
    { name: "Midnight Black", price: 59.99, description: "The classic choice for ultimate elegance.", category: "T-Shirt" },
    { name: "Solar Flare", price: 44.99, description: "Bright yellow energy for your space.", category: "T-Shirt" },
    { name: "Petal Pink", price: 47.99, description: "Soft pink hues for a delicate touch.", category: "T-Shirt" },
    { name: "Lavander Mist", price: 52.99, description: "Soothing lavander for a peaceful vibe.", category: "T-Shirt" },
    { name: "Cloud White", price: 42.99, description: "Pure white for a clean, minimal aesthetic.", category: "T-Shirt" },
    { name: "Stone Grey", price: 46.99, description: "Sophisticated grey for any environment.", category: "T-Shirt" }
];

const Jeans = [
    { name: "Crimson Rush Jean", price: 49.99, description: "Styles up your look Made In Thailand.", category: "Jeans" },
    { name: "Ocean Breeze Jean", price: 54.99, description: "Calming blue tones for a modern look.", category: "Jeans" },
    { name: "Midnight Black Jean", price: 59.99, description: "The classic choice for ultimate elegance.", category: "Jeans" },
    { name: "Solar Flare Jean", price: 44.99, description: "Bright Your Days Styles up your look Made In Turkey.", category: "Jeans" }
];

const seedDB = async () => {
    try {
        // Clear existing products to avoid duplicates during testing
        await Product.deleteMany({});
        console.log('Cleared existing products.');

        // Insert new data
        await Product.insertMany([...T_Shirts, ...Jeans]);
        console.log('Successfully added products to MongoDB!');

        process.exit();
    } catch (err) {
        console.error('Error seeding database:', err);
        process.exit(1);
    }
};

seedDB();
