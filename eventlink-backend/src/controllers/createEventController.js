const Event = require("../models/Event");
const path = require("path");
const fs = require("fs");

// Create a new event (Admin Only)
exports.createEvent = async (req, res) => {
  try {
    // For file upload, use multer or similar middleware in production. Here, handle basic file upload if present.
    let imageFilename = null;
    if (req.files && req.files.image) {
      const image = req.files.image;
      const uploadsDir = path.join(__dirname, "../../uploads");
      // Create uploads directory if it doesn't exist
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const uploadPath = path.join(uploadsDir, image.name);
      await image.mv(uploadPath);
      imageFilename = image.name;
    } else if (req.body.image) {
      // If using base64 or direct filename
      imageFilename = req.body.image;
    }

    // Ensure 'date' is always set for the required column
    let eventDate = req.body.date;
    if (!eventDate) {
      // Fallback: use start_date if present, else end_date
      eventDate = req.body.start_date || req.body.end_date || null;
    }

    const {
      title,
      category,
      description,
      attendance_reason,
      start_date,
      end_date,
      start_time,
      end_time,
      location,
      address,
      country,
      state,
      city,
      type,
      capacity,
      visibility,
    } = req.body;

    // Sanitize capacity: convert empty string to null, or parse as integer
    let sanitizedCapacity = capacity;
    if (typeof sanitizedCapacity === "string") {
      sanitizedCapacity = sanitizedCapacity.trim();
      if (sanitizedCapacity === "") {
        sanitizedCapacity = null;
      } else {
        sanitizedCapacity = parseInt(sanitizedCapacity, 10);
        if (isNaN(sanitizedCapacity)) sanitizedCapacity = null;
      }
    }

    // Check if the user is an admin
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Create the event
    const event = await Event.create({
      title,
      category,
      description,
      attendance_reason,
      date: eventDate,
      start_date,
      end_date,
      start_time,
      end_time,
      location,
      address,
      country,
      state,
      city,
      image: imageFilename,
      type,
      capacity: sanitizedCapacity,
      visibility,
    });

    // Handle ticket creation if tickets are provided
    let createdTickets = [];
    if (req.body.tickets) {
      let tickets;
      try {
        tickets = JSON.parse(req.body.tickets);
      } catch (err) {
        // Rollback event if ticket JSON is invalid
        await event.destroy();
        return res.status(400).json({ message: "Invalid ticket data format." });
      }
      if (!Array.isArray(tickets) || tickets.length === 0) {
        await event.destroy();
        return res
          .status(400)
          .json({ message: "At least one ticket type is required." });
      }
      try {
        const Ticket = require("../models/Ticket");
        createdTickets = await Promise.all(
          tickets.map(async (ticket) => {
            if (
              !ticket.type ||
              ticket.price === undefined ||
              ticket.quantity === undefined
            ) {
              throw new Error("Ticket type, price, and quantity are required.");
            }
            return await Ticket.create({
              type: ticket.type,
              price: ticket.price,
              quantity: ticket.quantity,
              available: ticket.quantity,
              event_id: event.id,
            });
          })
        );
      } catch (ticketErr) {
        await event.destroy();
        return res
          .status(400)
          .json({ message: ticketErr.message || "Failed to create tickets." });
      }
    }

    res.status(201).json({
      message: "Event created successfully",
      event,
      tickets: createdTickets,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Failed to create event" });
  }
};

// Public: Get all events (for browsing)
exports.getAllEvents = async (req, res) => {
  try {
    // Only fetch visible events
    const events = await Event.findAll({
      where: { visibility: true },
      order: [["start_date", "ASC"]],
    });
    res.status(200).json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Failed to fetch events" });
  }
};

// Get a single event by ID
exports.getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findOne({
      where: { id: eventId, visibility: true },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.status(200).json({ event });
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    res.status(500).json({ message: "Failed to fetch event" });
  }
};
