import React, { useState } from "react";
import axios from "axios";
import "../styles/Dashboard.css";

const defaultTicket = { type: "General", price: "", quantity: "" };

const TicketConfig = () => {
  const [tickets, setTickets] = useState([{ ...defaultTicket }]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleTicketChange = (idx, e) => {
    const { name, value } = e.target;
    setTickets((prev) =>
      prev.map((t, i) => (i === idx ? { ...t, [name]: value } : t))
    );
  };

  const addTicket = () => setTickets([...tickets, { ...defaultTicket }]);
  const removeTicket = (idx) => setTickets(tickets.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/auth/tickets`,
        { tickets },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message || "Tickets configured successfully.");
      setTickets([{ ...defaultTicket }]);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to configure tickets. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div
        className="register-card shadow-lg border border-2 border-primary-subtle p-4 rounded-4 bg-white w-100"
        style={{ maxWidth: 700 }}
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
            className="dashboard-title fw-bold text-primary mb-1"
            style={{ fontSize: "2rem" }}
          >
            Ticket Configuration
          </h2>
          <p className="text-secondary mb-0" style={{ fontSize: "1.1rem" }}>
            Add ticket types, prices, and quantities for your event.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="register-form">
          {tickets.map((ticket, idx) => (
            <div className="form-group mb-3 border-bottom pb-3" key={idx}>
              <div className="row g-2 align-items-center">
                <div className="col-md-5">
                  <input
                    type="text"
                    name="type"
                    className="form-control form-control-lg"
                    placeholder="Type (e.g. General, VIP)"
                    value={ticket.type}
                    onChange={(e) => handleTicketChange(idx, e)}
                    required
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="number"
                    name="price"
                    className="form-control form-control-lg"
                    placeholder="Price"
                    value={ticket.price}
                    onChange={(e) => handleTicketChange(idx, e)}
                    min="0"
                    required
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="number"
                    name="quantity"
                    className="form-control form-control-lg"
                    placeholder="Quantity"
                    value={ticket.quantity}
                    onChange={(e) => handleTicketChange(idx, e)}
                    min="1"
                    required
                  />
                </div>
                <div className="col-md-1 text-end">
                  {tickets.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => removeTicket(idx)}
                      title="Remove Ticket"
                    >
                      &times;
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div className="d-flex gap-2 mb-3">
            <button
              type="button"
              className="btn btn-outline-primary flex-grow-1"
              onClick={addTicket}
            >
              + Add Ticket Type
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-grow-1"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Ticket Types"}
            </button>
          </div>
        </form>
        {message && (
          <p className="register-footer mt-3 mb-0 text-secondary">{message}</p>
        )}
      </div>
    </div>
  );
};

export default TicketConfig;
