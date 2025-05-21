import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import eventsHomeImg from "../assets/images/events-home.png";
import "../styles/Home.css";

const BrowseEvents = () => {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventRes, catRes] = await Promise.all([
          axios.get("http://localhost:5000/api/auth/events"),
          axios.get("http://localhost:5000/api/auth/categories"),
        ]);
        setEvents(eventRes.data.events || []);
        console.log("Events Response", eventRes.data.events);
        setCategories(catRes.data.categories || []);
      } catch (err) {
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = category ? event.category === category : true;
    const matchesDate = date
      ? event.start_date && event.start_date.startsWith(date)
      : true;
    return matchesSearch && matchesCategory && matchesDate;
  });

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container" style={{ maxWidth: 1400 }}>
        <div className="row align-items-center mb-4 g-3">
          <div className="col-12 text-start">
            <h1
              className="fw-bold text-primary mb-1"
              style={{ fontSize: "2.5rem", letterSpacing: "-1px" }}
            >
              Browse Events
            </h1>
            <p className="text-secondary mb-3" style={{ fontSize: "1.15rem" }}>
              Discover and book your next experience. Use the search and filters
              to find events that interest you.
            </p>
          </div>
        </div>
        <div className="row mb-4 g-2">
          <div className="col-lg-4 col-md-6 col-12 mb-2 mb-lg-0">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search by event name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-lg-3 col-md-6 col-12 mb-2 mb-lg-0">
            <select
              className="form-select form-select-lg"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-lg-3 col-md-6 col-12 mb-2 mb-lg-0">
            <input
              type="date"
              className="form-control form-control-lg"
              value={date || ""}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Search by date"
            />
          </div>
        </div>
        <div className="row g-4 mt-2">
          {loading ? (
            <div className="col-12 text-center py-4">Loading events...</div>
          ) : error ? (
            <div className="col-12 text-danger py-4">{error}</div>
          ) : filteredEvents.length === 0 ? (
            <div className="col-12 text-center py-4">No events found.</div>
          ) : (
            filteredEvents.map((event) => (
              <div
                className="col-md-6 col-lg-4 d-flex align-items-stretch"
                key={event.id}
              >
                <div className="card shadow-lg border-0 w-100 h-100 animate__animated animate__fadeInUp">
                  <img
                    src={
                      event.image
                        ? event.image.startsWith("http")
                          ? event.image
                          : `/uploads/${event.image}`
                        : eventsHomeImg
                    }
                    className="card-img-top object-fit-cover border-bottom"
                    alt={event.title}
                    style={{
                      minHeight: 260,
                      maxHeight: 320,
                      objectFit: "cover",
                      borderTopLeftRadius: 18,
                      borderTopRightRadius: 18,
                    }}
                    onError={(e) => (e.target.src = eventsHomeImg)}
                  />
                  <div className="card-body d-flex flex-column h-100">
                    <span className="badge bg-warning text-dark mb-2">
                      {event.category || "Uncategorized"}
                    </span>
                    <h5
                      className="card-title fw-bold mb-2"
                      style={{ fontSize: "1.25rem" }}
                    >
                      {event.title}
                    </h5>
                    <div className="mb-2 text-muted small">
                      <span className="me-2">
                        <i className="bi bi-calendar3 me-1"></i>
                        {event.start_date
                          ? new Date(event.start_date).toLocaleDateString()
                          : "-"}
                      </span>
                      <span className="me-2">
                        <i className="bi bi-clock me-1"></i>
                        {event.start_time || "-"} - {event.end_time || "-"}
                      </span>
                      <span className="me-2">
                        <i className="bi bi-geo-alt-fill me-1"></i>
                        {event.location}
                      </span>
                      <span>
                        <i className="bi bi-people-fill me-1"></i>
                        {event.capacity} seats
                      </span>
                    </div>
                    <div className="mb-2">
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
                    <p
                      className="card-text mb-2"
                      style={{ fontSize: "1.05rem", color: "#444" }}
                    >
                      {event.description?.slice(0, 90)}
                      {event.description && event.description.length > 90
                        ? "..."
                        : ""}
                    </p>
                    <div className="mt-auto">
                      <Link
                        to={`/event/${event.id}`}
                        className="btn btn-primary btn-md fw-semibold shadow-sm rounded-pill d-flex align-items-center justify-content-center gap-2 mt-2"
                        style={{
                          letterSpacing: 0.2,
                          fontSize: "0.98rem",
                          padding: "0.5rem 1.1rem",
                        }}
                      >
                        <FontAwesomeIcon
                          icon={["fas", "arrow-right"]}
                          className="me-1"
                        />
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseEvents;
