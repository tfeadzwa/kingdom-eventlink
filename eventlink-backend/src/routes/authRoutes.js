const express = require("express");
const { loginUser } = require("../controllers/loginController");
const { registerUser } = require("../controllers/registerController");
const { verifyEmail } = require("../controllers/emailVerificationController");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/passwordResetController");
const {
  createEvent,
  getAllEvents,
} = require("../controllers/createEventController");
const { createTickets } = require("../controllers/ticketController");
const {
  createCategory,
  getCategories,
} = require("../controllers/categoryController");
const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Verify email route
router.get("/verify-email", verifyEmail);

// Forgot Password route
router.post("/forgot-password", forgotPassword);

// Reset Password route
router.post("/reset-password", resetPassword);

// Event creation route (Admin Only)
router.post("/events", authenticate, authorizeAdmin, createEvent);

// Public event browsing
router.get("/events", getAllEvents);

// Ticket configuration route (Admin Only)
router.post("/tickets", authenticate, authorizeAdmin, createTickets);

// Category routes
router.post("/categories", authenticate, authorizeAdmin, createCategory); // Admin only
router.get("/categories/", getCategories);

module.exports = router;
