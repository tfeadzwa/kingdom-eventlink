import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import notify from "../components/Notify.jsx";
import "../styles/Register.css";

const EventRegistration = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchEventAndTickets = async () => {
      try {
        const eventRes = await axios.get(
          `http://localhost:5000/api/auth/events`
        );
        const found = (eventRes.data.events || []).find(
          (e) => e.id === eventId
        );
        if (!found) throw new Error("Event not found");
        setEvent(found);
        // Fetch tickets for this event
        const ticketRes = await axios.get(
          `http://localhost:5000/api/auth/events/${eventId}/tickets`
        );
        setTickets(ticketRes.data.tickets || []);
        if (ticketRes.data.tickets && ticketRes.data.tickets.length > 0) {
          setSelectedTicket(ticketRes.data.tickets[0].id);
        }
      } catch (err) {
        notify.error("Failed to load event or tickets.");
      } finally {
        setLoading(false);
      }
    };
    fetchEventAndTickets();
  }, [eventId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // TODO: Implement booking API call
      notify.success("Registration successful! Your ticket is reserved.");
    } catch (err) {
      notify.error("Failed to register for event.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;
  if (!event) return <div className="text-danger py-5">Event not found.</div>;

  return (
    <div className="register-container bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div
        className="register-card shadow-lg border border-2 border-primary-subtle p-4 rounded-4 bg-white w-100"
        style={{ maxWidth: 500 }}
      >
        <div className="mb-4 text-center">
          <span className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-2">
            <svg
              width="32"
              height="32"
              fill="currentColor"
              className="text-primary"
            >
              <use href="#ticket" />
            </svg>
          </span>
          <h2
            className="fw-bold text-primary mb-1"
            style={{ fontSize: "2rem" }}
          >
            Register for {event.title}
          </h2>
          <p className="text-secondary mb-0" style={{ fontSize: "1.1rem" }}>
            Secure your spot by booking a ticket below.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group mb-3">
            <label htmlFor="ticketType" className="fw-semibold mb-1">
              Ticket Type
            </label>
            <select
              id="ticketType"
              className="form-select form-select-lg"
              value={selectedTicket}
              onChange={(e) => setSelectedTicket(e.target.value)}
              required
            >
              {tickets.map((ticket) => (
                <option key={ticket.id} value={ticket.id}>
                  {ticket.type} - ${ticket.price} ({ticket.available} left)
                </option>
              ))}
            </select>
          </div>
          <div className="form-group mb-4">
            <label htmlFor="quantity" className="fw-semibold mb-1">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              className="form-control form-control-lg"
              min={1}
              max={tickets.find((t) => t.id === selectedTicket)?.available || 1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>
          <button
            type="submit"
            className="register-button btn btn-primary btn-lg w-100 fw-bold shadow-sm"
            disabled={submitting}
          >
            {submitting ? "Registering..." : "Register Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventRegistration;
