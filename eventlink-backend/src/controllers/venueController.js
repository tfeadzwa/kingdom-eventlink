const Venue = require("../models/Venue");
const VenueRegistration = require("../models/VenueRegistration");
const VenueList = require("../models/VenueList");
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");

// Admin: Create a new venue
exports.createVenue = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const {
      name,
      slug,
      description,
      venue_type,
      amenities,
      guest_capacity,
      address,
      city,
      state,
      country,
      postal_code,
      latitude,
      longitude,
      availability,
      status,
      price_per_hour,
      price_per_day,
      price_currency,
      contact_phone,
      contact_email,
      image_url,
    } = req.body;

    // Slugify if not provided
    let venueSlug = slug;
    if (!venueSlug && name) {
      venueSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const venue = await Venue.create({
      name,
      slug: venueSlug,
      description,
      venue_type,
      amenities,
      guest_capacity,
      address,
      city,
      state,
      country,
      postal_code,
      latitude,
      longitude,
      availability,
      status,
      price_per_hour,
      price_per_day,
      price_currency,
      contact_phone,
      contact_email,
      image_url,
    });
    res.status(201).json({ message: "Venue created successfully", venue });
  } catch (error) {
    console.error("Error creating venue:", error);
    res.status(500).json({ message: "Failed to create venue" });
  }
};

// Public: Get all venues
exports.getAllVenues = async (req, res) => {
  try {
    const venues = await Venue.findAll({
      where: { status: { [Op.ne]: "archived" } },
      order: [["created_at", "DESC"]],
    });
    res.status(200).json({ venues });
  } catch (error) {
    console.error("Error fetching venues:", error);
    res.status(500).json({ message: "Failed to fetch venues" });
  }
};

// Public: Get a single venue by ID
exports.getVenueById = async (req, res) => {
  try {
    const { venueId } = req.params;
    const venue = await Venue.findOne({ where: { id: venueId } });
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }
    res.status(200).json({ venue });
  } catch (error) {
    console.error("Error fetching venue by ID:", error);
    res.status(500).json({ message: "Failed to fetch venue" });
  }
};

// Upload venue image
exports.uploadVenueImage = async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "No image file uploaded." });
    }
    const image = req.files.image;
    const uploadsDir = path.join(__dirname, "../../uploads/venues");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const filename = Date.now() + "-" + image.name.replace(/\s+/g, "-");
    const uploadPath = path.join(uploadsDir, filename);
    await image.mv(uploadPath);
    res.status(200).json({ filename });
  } catch (error) {
    console.error("Venue image upload error:", error);
    res.status(500).json({ message: "Failed to upload image." });
  }
};

// Book a venue (register)
exports.createVenueRegistration = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }
    const { venueId } = req.params;
    const { start_date, end_date, notes } = req.body;
    if (!start_date || !end_date) {
      return res
        .status(400)
        .json({ message: "Start and end date are required." });
    }
    // Check for overlapping bookings for this venue
    const overlapping = await VenueRegistration.findAll({
      where: {
        venue_id: venueId,
        status: { [Op.not]: "cancelled" },
        [Op.or]: [
          {
            start_date: { [Op.lte]: end_date },
            end_date: { [Op.gte]: start_date },
          },
        ],
      },
      order: [["start_date", "ASC"]],
    });
    if (overlapping.length > 0) {
      // Format booked date ranges for the response
      const bookedRanges = overlapping.map((b) => ({
        start_date: b.start_date,
        end_date: b.end_date,
      }));
      // Find the latest end_date to suggest when the venue will be free
      const latestEnd = overlapping.reduce(
        (max, b) => (b.end_date > max ? b.end_date : max),
        overlapping[0].end_date
      );
      return res.status(409).json({
        message: "Venue is already booked for the selected dates.",
        booked: bookedRanges,
        next_available: latestEnd,
      });
    }
    // No overlap, allow booking
    const registration = await VenueRegistration.create({
      user_id: req.user.id,
      venue_id: venueId,
      start_date,
      end_date,
      notes,
      status: "booked",
    });
    // Mark the venue as unavailable
    await Venue.update({ availability: false }, { where: { id: venueId } });
    res
      .status(201)
      .json({ message: "Venue booked successfully.", registration });
  } catch (error) {
    console.error("Venue booking error:", error);
    res.status(500).json({ message: "Failed to book venue." });
  }
};

// Get all bookings for a venue (admin or venue owner)
exports.getVenueRegistrations = async (req, res) => {
  try {
    const { venueId } = req.params;
    const registrations = await VenueRegistration.findAll({
      where: { venue_id: venueId },
      order: [["created_at", "DESC"]],
    });
    res.status(200).json({ registrations });
  } catch (error) {
    console.error("Error fetching venue registrations:", error);
    res.status(500).json({ message: "Failed to fetch venue registrations." });
  }
};

// Get all venue registrations for the current user (with venue details)
exports.getMyVenueRegistrations = async (req, res) => {
  try {
    const userId = req.user.id;
    const registrations = await VenueRegistration.findAll({
      where: { user_id: userId },
      include: [
        {
          model: require("../models/Venue"),
          as: "venue",
        },
      ],
      order: [["created_at", "DESC"]],
    });
    res.status(200).json({ registrations });
  } catch (error) {
    console.error("Error fetching user venue registrations:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch your venue registrations." });
  }
};

// Get all venue list entries (for CreateVenue dropdown)
exports.getVenueList = async (req, res) => {
  try {
    const venues = await VenueList.findAll();
    res.status(200).json({ venues });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch venue list." });
  }
};
