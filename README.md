# DUMA Backend - Comprehensive Implementation Guide 🛡️

This documentation tracks the step-by-step development of the DUMA Streetwear API, from the very first command to the current high-performance state.

---

## 🛠️ Step-by-Step Development Journey

### **Step 1: Environment & Initial Setup**
- ⚙️ **Node.js Installation:** Downloaded and installed Node.js environment.
- 📦 **Initialization:** Created the project foundation using `npm init -y`.
- 🚀 **Express Framework:** Installed Express.js (`npm install express`) to handle HTTP requests.
- 🔄 **Nodemon:** Set up `nodemon` for an efficient development workflow with automatic restarts.

### **Step 2: Database & Architecture**
- 🍃 **MongoDB Connection:** Integrated **Mongoose** to connect with MongoDB Atlas cloud storage.
- 📁 **Folder Structure:** Organized the project into a professional architecture:
  - `/models`: Database schemas.
  - `/routes`: API endpoints.
  - `/middleware`: Security and helper logic.
  - `/config`: Connection settings.

### **Step 3: Security & Authentication**
- 🔐 **User Model:** Created a secure User Schema with **isBlocked** status.
- 🔑 **Hashing:** Implemented **Bcrypt** to automatically hash passwords before saving them to the database.
- 🎟️ **JWT (JSON Web Token):** Built a secure token-based authentication system for login sessions.
- 🛡️ **Admin Verification:** Developed middleware to ensure only authorized admins can access management tools.

### **Step 4: Product & Category Management**
- 🏷️ **Category Logic:** Created routes to manage product categories with unique name constraints.
- 🛍️ **Product CRUD:** Implemented full Add/Edit/Delete/List functionality for streetwear products.
- 🖼️ **Multer Integration:** Set up image upload handling, storing product visuals in a local `/uploads` directory.
- 🧹 **Cascading Updates:** Engineered logic to handle category deletions, automatically moving orphaned products to "Uncategorized".

### **Step 5: Advanced Admin Operations**
- 👥 **Customer Management:** Developed a centralized system to view all users and their individual purchase history.
- 📈 **Stats Engine:** Built logic to calculate **Total Orders** and **Total Expenditure** per customer.
- ⛔ **Access Control:** Implemented the `Block/Unblock` system to restrict unauthorized or banned users.
- 🛠️ **Route Consolidation:** Unified all admin-related tasks into a single, high-performance `adminRoutes.js`.

### **Step 6: Network & Mobile Optimization**
- 🌍 **Global Listening:** Configured the server to listen on `0.0.0.0`, making it accessible across the local Wi-Fi network.
- 📡 **CORS Strategy:** Customized the Cross-Origin Resource Sharing policy to permit requests from mobile device IP addresses.
- 🔍 **404/500 Debugging:** Added global error logging to track and resolve unmatched routes instantly.

---

## 🚀 API Architecture Summary

### **User Endpoints (`/api/user`)**
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| **GET** | `/categories` | Fetch all product categories | ❌ |
| **POST** | `/register` | Register a new user account | ❌ |
| **POST** | `/login` | Authenticate user & get token | ❌ |
| **GET** | `/products` | List all available products | ❌ |
| **POST** | `/orders` | Create a new purchase order | ✅ |
| **GET** | `/orders/my-orders` | View logged-in user's order history | ✅ |
| **POST** | `/payment/create-order` | Initiate Razorpay order (returns order_id) | ✅ |
| **POST** | `/payment/verify` | Verify Razorpay signature & mark order as paid | ✅ |

### **Admin Endpoints (`/api/admin`)**

#### **Customer & Admin Management**
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| **POST** | `/login` | Admin secure login | ❌ |
| **GET** | `/customers` | List all registered customers | ✅ |
| **GET** | `/customers/:id` | View specific customer details & order stats | ✅ |
| **PUT/PATCH** | `/customers/:id/block` | Toggle customer block status | ✅ |
| **DELETE** | `/customers/:id` | Delete a customer account | ✅ |

#### **Category Management**
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| **GET** | `/categories` | List all categories for management | ✅ |
| **POST** | `/categories` | Add new category with image upload | ✅ |
| **PUT** | `/categories/:id` | Update category name/image | ✅ |
| **DELETE** | `/categories/:id` | Delete category (Moves products to Uncategorized) | ✅ |

#### **Product Management**
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| **GET** | `/allproducts` | List all products with full details | ✅ |
| **POST** | `/addproducts` | Create new product with image upload | ✅ |
| **PUT** | `/updateproducts/:id` | Update product details or images | ✅ |
| **DELETE** | `/deleteproducts/:id` | Remove a product from the database | ✅ |

#### **Order Management**
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| **GET** | `/orders` | View all customer orders globally | ✅ |
| **PUT** | `/orders/:id/status` | Update order delivery/payment status | ✅ |
| **GET** | `/payments/:paymentId` | Fetch payment details directly from Razorpay | ✅ |

---

## ⚙️ Installation & Running

1. **Clone & Install:**
   ```bash
   npm install
   ```
2. **Environment Setup (.env):**
   ```env
   PORT=5001
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key
   ```
3. **Start Development Server:**
   ```bash
   npm run dev
   ```

---

## 📄 License
Distributed under the MIT License.

Built with ⚡ by [Azar Ibrahim](https://github.com/azarrazagula)
