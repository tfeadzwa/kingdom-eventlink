const express = require("express");
const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");
const {
  createVenue,
  getAllVenues,
  getVenueById,
  uploadVenueImage,
  createVenueRegistration,
  getVenueRegistrations,
  getVenueList,
  getMyVenueRegistrations,
} = require("../controllers/venueController");

const router = express.Router();

// Admin: Create a venue
router.post("/venues", authenticate, authorizeAdmin, createVenue);

// Public: Get all venues
router.get("/venues", getAllVenues);

// User: Get all venue registrations for the current user
router.get("/venues/my-registrations", authenticate, getMyVenueRegistrations);

// Public: Get single venue by ID
router.get("/venues/:venueId", getVenueById);

// Public: Get all venue list entries (for CreateVenue dropdown)
router.get("/venue-list", getVenueList);

// Venue image upload
router.post("/upload-image", authenticate, authorizeAdmin, uploadVenueImage);

// Book a venue (user)
router.post("/venues/:venueId/book", authenticate, createVenueRegistration);

// Get all bookings for a venue (admin)
router.get(
  "/venues/:venueId/registrations",
  authenticate,
  authorizeAdmin,
  getVenueRegistrations
);

module.exports = router;
