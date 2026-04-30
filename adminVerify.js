require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");
const connectDB = require("./config/db");

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminData = {
      name: "Asker Admin",
      email: "asker@gmail.com",
      password: "123456",
      role: "admin"
    };

    const adminExists = await Admin.findOne({ email: adminData.email });

    if (adminExists) {
      console.log("Admin already exists in the database.");
    } else {
      await Admin.create(adminData);
      console.log("Admin created successfully!");
      console.log("Email: asker@gmail.com");
      console.log("Password: 123456");
    }

    process.exit();
  } catch (error) {
    console.error("Error verifying admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
