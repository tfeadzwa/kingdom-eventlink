const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const venueRoutes = require("./routes/venueRoutes");
const adminRoutes = require("./routes/adminRoutes");
const sequelize = require("./config/database");
const User = require("./models/User");

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());

// Enable CORS
app.use(cors());

// Add custom logging middleware
app.use(
  morgan(":method :url :status :response-time ms - :res[content-length]")
);

// Add file upload middleware
app.use(fileUpload());

// Test database connection
sequelize
  .sync()
  .then(() => {
    console.log("Database connected and models synchronized");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/admin", adminRoutes);

module.exports = app;
