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
  getEventById,
} = require("../controllers/createEventController");
const {
  createTickets,
  getTicketsByEvent,
} = require("../controllers/ticketController");
const {
  createCategory,
  getCategories,
} = require("../controllers/categoryController");
const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");
const {
  registerForEvent,
} = require("../controllers/eventRegistrationController");

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
// Get single event by ID
router.get("/events/:eventId", getEventById);
// Get tickets for a specific event
router.get("/events/:eventId/tickets", getTicketsByEvent);

// Register for an event (Authenticated users)
router.post("/events/:eventId/register", authenticate, registerForEvent);

// Ticket configuration route (Admin Only)
router.post("/tickets", authenticate, authorizeAdmin, createTickets);

// Category routes
router.post("/categories", authenticate, authorizeAdmin, createCategory); // Admin only
router.get("/categories/", getCategories);

module.exports = router;
