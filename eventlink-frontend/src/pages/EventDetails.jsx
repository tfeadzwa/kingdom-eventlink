import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import eventsHomeImg from "../assets/images/events-hole.jpg";
import paynowLogoBlue from "../assets/images/paynow-logo-blue.svg";
import { AuthContext } from "../context/AuthContext";
import notify from "../components/Notify.jsx";
import "../styles/Register.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Swal from "sweetalert2";

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [ticketSelections, setTicketSelections] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [showSummary, setShowSummary] = useState(false);
  const [selectedBank, setSelectedBank] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);

  const banks = [
    { code: "fbc", name: "FBC Bank" },
    { code: "cbz", name: "CBZ Bank" },
    { code: "stanchart", name: "Standard Chartered" },
    { code: "ecobank", name: "Ecobank" },
    { code: "bancabc", name: "BancABC" },
  ];

  useEffect(() => {
    const fetchEventAndTickets = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/events`);
        const found = (res.data.events || []).find((e) => e.id === eventId);
        if (!found) throw new Error("Event not found");
        setEvent(found);
        const ticketRes = await axios.get(
          `http://localhost:5000/api/auth/events/${eventId}/tickets`
        );
        setTickets(ticketRes.data.tickets || []);
        if (ticketRes.data.tickets && ticketRes.data.tickets.length > 0) {
          setTicketSelections(
            ticketRes.data.tickets.map((t) => ({ ticketId: t.id, quantity: 0 }))
          );
        }
      } catch (err) {
        setError("Failed to load event details or tickets.");
      } finally {
        setLoading(false);
      }
    };
    fetchEventAndTickets();
  }, [eventId]);

  const handleTicketQuantityChange = (ticketId, value) => {
    setTicketSelections((selections) =>
      selections.map((sel) =>
        sel.ticketId === ticketId
          ? { ...sel, quantity: Math.max(0, Number(value)) }
          : sel
      )
    );
  };

  const totalPrice = ticketSelections
    .reduce((sum, sel) => {
      const ticket = tickets.find((t) => t.id === sel.ticketId);
      return sum + (ticket ? Number(ticket.price) * sel.quantity : 0);
    }, 0)
    .toFixed(2);

  const PaymentSummaryOverlay = () => (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(30, 34, 90, 0.70)",
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(3px)",
      }}
    >
      <div
        className="card shadow-lg animate__animated animate__fadeInDown payment-summary-card border-0"
        style={{
          minWidth: 370,
          maxWidth: 700,
          width: "100%",
          maxHeight: "96vh",
          overflowY: "auto",
          borderRadius: 36,
          background: "linear-gradient(135deg, #f8fafc 80%, #e3e8ff 100%)",
          boxShadow: "0 12px 48px 0 rgba(31, 38, 135, 0.25)",
          padding: 0,
        }}
      >
        <div className="p-5 pb-0" style={{ borderRadius: 36, minWidth: 340 }}>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h2
              className="fw-bold text-primary mb-0"
              style={{ letterSpacing: 0.5, fontSize: "2.1rem" }}
            >
              Payment Summary
            </h2>
            <button
              className="btn btn-link text-danger fs-3 p-0"
              style={{ textDecoration: "none" }}
              onClick={() => setShowSummary(false)}
              disabled={paymentLoading}
              aria-label="Close payment summary"
            >
              <i className="bi bi-x-lg"></i>
            </button>
          </div>
          <div className="mb-4 pb-3 border-bottom">
            <div className="d-flex justify-content-between mb-2">
              <span className="fw-semibold text-secondary fs-5">Event:</span>
              <span className="fw-semibold fs-5">{event.title}</span>
            </div>
            {ticketSelections
              .filter((sel) => sel.quantity > 0)
              .map((sel) => {
                const ticket = tickets.find((t) => t.id === sel.ticketId);
                if (!ticket) return null;
                return (
                  <div
                    key={sel.ticketId}
                    className="d-flex justify-content-between align-items-center rounded px-3 py-2 mb-2"
                    style={{
                      background: "#f6f8ff",
                      border: "1px solid #e3e8ff",
                      fontSize: "1.13rem",
                    }}
                  >
                    <span className="fw-semibold text-primary">
                      {ticket.type}
                    </span>
                    <span className="text-dark">
                      {sel.quantity} x{" "}
                      <span className="fw-bold">${ticket.price}</span> =
                      <span className="ms-1 text-success fw-bold">
                        ${(Number(ticket.price) * sel.quantity).toFixed(2)}
                      </span>
                    </span>
                  </div>
                );
              })}
            <div className="d-flex justify-content-between border-top pt-4 fs-4 mt-4">
              <span className="fw-bold text-dark">Total Price:</span>
              <span className="text-success fw-bold fs-3">${totalPrice}</span>
            </div>
          </div>
          <h4 className="fw-bold mb-4 text-center text-primary">
            Choose Payment Platform
          </h4>
          <div className="d-flex flex-column flex-md-row gap-4 justify-content-center mb-5">
            <button
              className="btn btn-outline-primary btn-lg flex-grow-1 d-flex flex-column align-items-center justify-content-center gap-2 shadow-sm py-3"
              style={{
                borderRadius: 18,
                fontWeight: 600,
                fontSize: "1.15rem",
                minHeight: 110,
              }}
              onClick={async () => {
                setShowSummary(false);
                setPaymentLoading(true);
                await new Promise((r) => setTimeout(r, 1800));
                await handleSubmit();
                setPaymentLoading(false);
                Swal.fire({
                  icon: "success",
                  title: "Payment Complete!",
                  text: "You have been registered after payment.",
                  confirmButtonColor: "#3085d6",
                });
              }}
              disabled={submitting || paymentLoading}
            >
              <img
                src={paynowLogoBlue}
                alt="PayNow"
                style={{ height: 38, marginBottom: 8 }}
                className="paynow-logo"
              />
              <span style={{ fontWeight: 700 }}>Pay with PayNow</span>
            </button>
            <div className="flex-grow-1">
              <button
                className="btn btn-outline-secondary btn-lg w-100 fw-bold d-flex flex-column align-items-center justify-content-center gap-2 shadow-sm py-3"
                style={{
                  borderRadius: 18,
                  fontWeight: 600,
                  fontSize: "1.15rem",
                  minHeight: 110,
                }}
                disabled
              >
                <FontAwesomeIcon
                  icon={["fas", "bank"]}
                  style={{ fontSize: 36, marginBottom: 8 }}
                />
                <span>Bank Transfer</span>
                <span
                  className="text-warning mt-2"
                  style={{ fontSize: 15, fontWeight: 500 }}
                >
                  Coming Soon
                </span>
              </button>
            </div>
            <button
              className="btn btn-outline-secondary btn-lg flex-grow-1 d-flex flex-column align-items-center justify-content-center gap-2 shadow-sm py-3"
              style={{
                borderRadius: 18,
                fontWeight: 600,
                fontSize: "1.15rem",
                minHeight: 110,
              }}
              disabled
            >
              <FontAwesomeIcon
                icon={["fas", "credit-card"]}
                style={{ fontSize: 36, marginBottom: 8 }}
              />
              <span>Card</span>
              <span
                className="text-warning mt-2"
                style={{ fontSize: 15, fontWeight: 500 }}
              >
                Coming Soon
              </span>
            </button>
          </div>
          {paymentLoading && (
            <div className="text-center mt-4 mb-2">
              <span
                className="spinner-border text-primary"
                role="status"
                style={{ width: 36, height: 36 }}
              />
              <div className="fw-semibold mt-3 fs-5">Processing payment...</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const selected = ticketSelections.filter((sel) => sel.quantity > 0);
      if (selected.length === 0) {
        notify.error("Please select at least one ticket.");
        setSubmitting(false);
        return;
      }
      const res = await axios.post(
        `http://localhost:5000/api/auth/events/${eventId}/register`,
        {
          tickets: selected,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      notify.success(
        res.data.message ||
          "Registration successful! Your ticket(s) are reserved."
      );
      setMessage(
        res.data.message ||
          "Registration successful! Your ticket(s) are reserved."
      );
    } catch (err) {
      notify.error(
        err.response?.data?.message || "Failed to register for event."
      );
      setMessage(
        err.response?.data?.message || "Failed to register for event."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div
        className="text-center py-5 min-vh-100 min-vw-100"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        Loading event details...
      </div>
    );
  if (error)
    return (
      <div
        className="text-danger py-5 min-vh-100 min-vw-100"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        {error}
      </div>
    );
  if (!event) return null;

  return (
    <div
      className="container-fluid px-0"
      style={{ background: "#f8f9fa", minHeight: "100vh" }}
    >
      <div
        className="position-relative w-100"
        style={{ minHeight: 380, maxHeight: 480, overflow: "hidden" }}
      >
        <img
          src={
            event.image
              ? event.image.startsWith("http")
                ? event.image
                : `/uploads/${event.image}`
              : eventsHomeImg
          }
          alt={event.title}
          className="w-100 object-fit-cover"
          style={{
            minHeight: 380,
            maxHeight: 480,
            objectFit: "cover",
            filter: "brightness(0.93)",
          }}
          onError={(e) => (e.target.src = eventsHomeImg)}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(180deg,rgba(255,255,255,0.01) 60%,rgba(248,249,250,0.98) 100%)",
            pointerEvents: "none",
          }}
        ></div>
      </div>

      <div
        className="container"
        style={{
          maxWidth: 950,
          marginTop: -80,
          zIndex: 2,
          position: "relative",
        }}
      >
        <div className="row g-4">
          <div className="col-12">
            <div className="card shadow-lg border-0 p-4 mb-4 animate__animated animate__fadeInUp">
              <div className="d-flex flex-wrap flex-md-nowrap align-items-center justify-content-between mb-3 gap-3">
                <div className="flex-grow-1">
                  <h2 className="fw-bold mb-1" style={{ fontSize: "2.1rem" }}>
                    {event.title}
                  </h2>
                  <div className="mb-2 text-muted small">
                    <span className="me-3">
                      <i className="bi bi-calendar3 me-1"></i>
                      {event.start_date
                        ? new Date(event.start_date).toLocaleDateString()
                        : "-"}
                    </span>
                    <span className="me-3">
                      <i className="bi bi-clock me-1"></i>
                      {event.start_time || "-"} - {event.end_time || "-"}
                    </span>
                    <span className="me-3">
                      <i className="bi bi-geo-alt-fill me-1"></i>
                      {event.location}
                    </span>
                    <span>
                      <i className="bi bi-people-fill me-1"></i>
                      {event.capacity} seats
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="badge bg-warning text-dark me-2">
                      {event.category || "Uncategorized"}
                    </span>
                    <span className="badge bg-info text-dark me-2">
                      {event.type?.charAt(0).toUpperCase() +
                        event.type?.slice(1)}
                    </span>
                    {event.visibility ? (
                      <span className="badge bg-success">Public</span>
                    ) : (
                      <span className="badge bg-secondary">Private</span>
                    )}
                  </div>
                  <div className="mb-2 text-muted small">
                    <span className="me-3">
                      <i className="bi bi-geo-alt"></i> {event.address || "-"}
                    </span>
                    <span>
                      <i className="bi bi-globe"></i> {event.country || "-"},{" "}
                      {event.state || "-"}, {event.city || "-"}
                    </span>
                  </div>
                </div>
                <div className="d-flex flex-column align-items-end gap-2">
                  <Link
                    to="/browse-events"
                    className="btn btn-outline-secondary mb-2"
                  >
                    <i className="bi bi-arrow-left"></i> Browse Events
                  </Link>
                  {user && tickets.length > 0 && (
                    <a
                      href="#register"
                      className="btn btn-primary btn-lg fw-bold shadow-sm rounded-pill px-4"
                    >
                      <FontAwesomeIcon
                        icon={["fas", "ticket"]}
                        className="me-2"
                      />
                      Get Tickets Now
                    </a>
                  )}
                </div>
              </div>
              <div className="mb-3" style={{ fontSize: "1.13rem" }}>
                {event.description}
              </div>
              {event.attendance_reason && (
                <div className="alert alert-light border mb-3">
                  <strong>Why Attend?</strong>
                  <div>{event.attendance_reason}</div>
                </div>
              )}
            </div>
          </div>

          {/* Tickets Table Section */}
          <div className="col-12">
            <div className="card shadow-sm border-0 p-4 mb-4 animate__animated animate__fadeInUp">
              <h4 className="fw-bold mb-3">
                <FontAwesomeIcon
                  icon={["fas", "ticket"]}
                  className="me-2 text-primary"
                />
                Tickets
              </h4>
              {tickets.length === 0 ? (
                <div className="alert alert-secondary">
                  No tickets available for this event.
                </div>
              ) : (
                <div className="table-responsive mb-4">
                  <table className="table table-bordered align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Type</th>
                        <th>Price</th>
                        <th>Available</th>
                        <th style={{ width: 180 }}>Select Quantity</th>
                        <th style={{ width: 120 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((ticket) => {
                        const sel = ticketSelections.find(
                          (s) => s.ticketId === ticket.id
                        ) || { quantity: 0 };
                        return (
                          <tr
                            key={ticket.id}
                            className={sel.quantity > 0 ? "table-primary" : ""}
                          >
                            <td className="fw-semibold">{ticket.type}</td>
                            <td className="text-info">${ticket.price}</td>
                            <td>{ticket.available}</td>
                            <td>
                              <div className="input-group input-group-sm flex-nowrap">
                                <button
                                  className="btn btn-outline-secondary px-2"
                                  type="button"
                                  disabled={sel.quantity <= 0}
                                  onClick={() =>
                                    handleTicketQuantityChange(
                                      ticket.id,
                                      sel.quantity - 1
                                    )
                                  }
                                  aria-label={`Decrease ${ticket.type} quantity`}
                                >
                                  <FontAwesomeIcon icon="minus" />
                                </button>
                                <input
                                  type="number"
                                  className="form-control text-center mx-1"
                                  min={0}
                                  max={ticket.available}
                                  value={sel.quantity}
                                  onChange={(e) =>
                                    handleTicketQuantityChange(
                                      ticket.id,
                                      e.target.value
                                    )
                                  }
                                  style={{ width: 60 }}
                                  aria-label={`${ticket.type} quantity`}
                                />
                                <button
                                  className="btn btn-outline-secondary px-2"
                                  type="button"
                                  disabled={sel.quantity >= ticket.available}
                                  onClick={() =>
                                    handleTicketQuantityChange(
                                      ticket.id,
                                      sel.quantity + 1
                                    )
                                  }
                                  aria-label={`Increase ${ticket.type} quantity`}
                                >
                                  <FontAwesomeIcon icon="plus" />
                                </button>
                              </div>
                            </td>
                            <td>
                              <button
                                type="button"
                                className={`btn btn-${
                                  sel.quantity > 0
                                    ? "danger"
                                    : "outline-primary"
                                } btn-sm w-100 fw-bold`}
                                onClick={() =>
                                  handleTicketQuantityChange(
                                    ticket.id,
                                    sel.quantity > 0 ? 0 : 1
                                  )
                                }
                              >
                                {sel.quantity > 0 ? "Remove" : "Select"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="d-flex justify-content-end mt-3">
                    <span className="fw-bold fs-5">
                      Total: <span className="text-success">${totalPrice}</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="col-12" id="register">
            <div className="card shadow-sm border-0 p-4 animate__animated animate__fadeInUp">
              <h4 className="fw-bold mb-3">
                <FontAwesomeIcon
                  icon={["fas", "user-plus"]}
                  className="me-2 text-primary"
                />
                Register
              </h4>
              {user ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setShowSummary(true);
                  }}
                  className="register-form"
                >
                  <button
                    type="button"
                    className="btn btn-primary btn-lg w-100 fw-bold shadow-sm rounded-pill d-flex align-items-center justify-content-center gap-2"
                    disabled={
                      submitting ||
                      ticketSelections.every((sel) => sel.quantity === 0)
                    }
                    style={{ fontSize: "1.08rem", letterSpacing: 0.2 }}
                    onClick={() => setShowSummary(true)}
                  >
                    <FontAwesomeIcon
                      icon={["fas", "ticket"]}
                      className="me-1"
                    />
                    Show Payment Summary
                  </button>
                </form>
              ) : (
                <div className="alert alert-info text-center mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  Please <Link to="/login">log in</Link> to register or book a
                  ticket.
                </div>
              )}
              {message && (
                <div className="alert alert-info mt-4 text-center animate__animated animate__fadeInDown">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showSummary && <PaymentSummaryOverlay />}
    </div>
  );
};

export default EventDetails;
