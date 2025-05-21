const Ticket = require("../models/Ticket");
const Event = require("../models/Event");
const User = require("../models/User");
const Registration = require("../models/Registration");

// This is a simple in-controller registration logic. For production, use a dedicated Registration model.
exports.registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { tickets } = req.body; // [{ticketId, quantity}]
    const userId = req.user.id;

    if (!Array.isArray(tickets) || tickets.length === 0) {
      return res.status(400).json({ message: "No tickets selected." });
    }

    // Validate all tickets
    const event = await Event.findOne({
      where: { id: eventId, visibility: true },
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // Check all tickets belong to this event and are available
    const ticketIds = tickets.map((t) => t.ticketId);
    const dbTickets = await Ticket.findAll({
      where: { id: ticketIds, event_id: eventId },
    });
    if (dbTickets.length !== tickets.length) {
      return res.status(400).json({ message: "Invalid ticket selection." });
    }

    // Check availability and prepare updates
    for (const sel of tickets) {
      const dbTicket = dbTickets.find((t) => t.id === sel.ticketId);
      if (!dbTicket || sel.quantity < 1 || dbTicket.available < sel.quantity) {
        return res
          .status(400)
          .json({
            message: `Not enough tickets available for ${
              dbTicket?.type || "selected type"
            }.`,
          });
      }
    }

    // Decrement availability and create registrations
    for (const sel of tickets) {
      const dbTicket = dbTickets.find((t) => t.id === sel.ticketId);
      dbTicket.available -= sel.quantity;
      await dbTicket.save();
      await Registration.create({
        user_id: userId,
        event_id: eventId,
        ticket_id: sel.ticketId,
        quantity: sel.quantity,
      });
    }

    return res
      .status(200)
      .json({ message: "Successfully registered for event." });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ message: "Failed to register for event." });
  }
};
