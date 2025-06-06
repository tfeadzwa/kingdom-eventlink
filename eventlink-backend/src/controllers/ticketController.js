const Ticket = require("../models/Ticket");

// Create ticket types (Admin Only)
exports.createTickets = async (req, res) => {
  try {
    const { tickets } = req.body; // tickets: [{type, price, quantity}]

    // Check if the user is an admin
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Create tickets
    const createdTickets = await Promise.all(
      tickets.map(async (ticket) => {
        return await Ticket.create({
          type: ticket.type,
          price: ticket.price,
          quantity: ticket.quantity,
          available: ticket.quantity,
        });
      })
    );

    res.status(201).json({
      message: "Tickets created successfully",
      tickets: createdTickets,
    });
  } catch (error) {
    console.error("Error creating tickets:", error);
    res.status(500).json({ message: "Failed to create tickets" });
  }
};

// Get tickets for a specific event
exports.getTicketsByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const tickets = await Ticket.findAll({ where: { event_id: eventId } });
    res.status(200).json({ tickets });
  } catch (error) {
    console.error("Error fetching tickets for event:", error);
    res.status(500).json({ message: "Failed to fetch tickets for event" });
  }
};
