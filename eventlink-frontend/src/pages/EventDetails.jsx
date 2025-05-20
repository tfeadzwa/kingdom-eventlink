import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import eventsHomeImg from "../assets/images/events-hole.jpg";
import { AuthContext } from "../context/AuthContext";

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/events`);
        const found = (res.data.events || []).find((e) => e.id === eventId);
        if (!found) throw new Error("Event not found");
        setEvent(found);
      } catch (err) {
        setError("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

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
      className="container py-5 min-vh-100 min-vw-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div className="container" style={{ maxWidth: "85dvw" }}>
        <div className="mb-4">
          <Link
            to="/browse-events"
            className="btn btn-link text-decoration-none"
          >
            <i className="bi bi-arrow-left"></i> Back to Events
          </Link>
        </div>
        <div className="card shadow-lg border-0">
          <div className="row g-0">
            <div className="col-md-5">
              <img
                src={
                  event.image
                    ? event.image.startsWith("http")
                      ? event.image
                      : `/uploads/${event.image}`
                    : eventsHomeImg
                }
                className="img-fluid rounded-start w-100 h-100 object-fit-cover"
                alt={event.title}
                style={{ minHeight: 320, maxHeight: 420, objectFit: "cover" }}
                onError={(e) => (e.target.src = eventsHomeImg)}
              />
            </div>
            <div className="col-md-7">
              <div className="card-body d-flex flex-column h-100">
                <div className="mb-2">
                  <span className="badge bg-warning text-dark mb-2">
                    {event.category || "Uncategorized"}
                  </span>
                  <h2 className="card-title fw-bold mb-2">{event.title}</h2>
                  <div className="mb-3 text-muted small">
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
                  <div className="mb-3">
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
                  <p className="card-text mb-3" style={{ fontSize: "1.1rem" }}>
                    {event.description}
                  </p>
                  {event.attendance_reason && (
                    <div className="alert alert-light border mb-3">
                      <strong>Why Attend?</strong>
                      <div>{event.attendance_reason}</div>
                    </div>
                  )}
                  <div className="row mb-2">
                    <div className="col-6">
                      <div className="text-muted small">
                        <i className="bi bi-geo-alt"></i> {event.address || "-"}
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="text-muted small text-end">
                        <i className="bi bi-globe"></i> {event.country || "-"},{" "}
                        {event.state || "-"}, {event.city || "-"}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-auto">
                  {user ? (
                    <button
                      className="btn btn-primary btn-lg w-100"
                      onClick={() =>
                        (window.location.href = `/event/${event.id}/register`)
                      }
                    >
                      Register / Book Ticket
                    </button>
                  ) : (
                    <div className="alert alert-info text-center mb-0">
                      <i className="bi bi-info-circle me-2"></i>
                      Please <Link to="/login">log in</Link> to register or book
                      a ticket.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
