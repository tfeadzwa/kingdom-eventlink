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
                <div className="card shadow-sm border-0 w-100 h-100">
                  <div
                    className="card-header bg-primary text-white position-relative d-flex align-items-center"
                    style={{ minHeight: 60 }}
                  >
                    <span
                      className="badge bg-warning text-dark position-absolute top-0 end-0 m-2"
                      style={{ fontSize: "0.95rem" }}
                    >
                      {event.category || "Uncategorized"}
                    </span>
                    <h5
                      className="mb-0 fw-bold"
                      style={{ fontSize: "1.25rem", letterSpacing: "-0.5px" }}
                    >
                      {event.title}
                    </h5>
                  </div>
                  <div className="row g-0">
                    <div className="col-5">
                      <div className="h-100 d-flex align-items-center justify-content-center p-2">
                        <img
                          src={
                            event.image
                              ? event.image.startsWith("http")
                                ? event.image
                                : `/uploads/${event.image}`
                              : eventsHomeImg
                          }
                          className="img-fluid rounded"
                          alt={event.title}
                          style={{
                            maxHeight: 140,
                            objectFit: "cover",
                            width: "100%",
                          }}
                          onError={(e) => (e.target.src = eventsHomeImg)}
                        />
                      </div>
                    </div>
                    <div className="col-7">
                      <div className="card-body d-flex flex-column h-100">
                        <div className="mb-2">
                          <div
                            className="mb-2 text-muted small"
                            style={{ fontSize: "0.98rem" }}
                          >
                            <span className="me-2">
                              <FontAwesomeIcon
                                icon={["fas", "calendar-plus"]}
                                className="me-1 text-primary"
                              />
                              {event.start_date
                                ? new Date(
                                    event.start_date
                                  ).toLocaleDateString()
                                : "-"}
                            </span>
                            <span className="me-2">
                              <FontAwesomeIcon
                                icon={["fas", "location-dot"]}
                                className="me-1 text-secondary"
                              />
                              {event.location}
                            </span>
                            <span>
                              <FontAwesomeIcon
                                icon={["fas", "tag"]}
                                className="me-1 text-info"
                              />
                              {event.type}
                            </span>
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
                        </div>
                        <div className="mt-auto">
                          <Link
                            to={`/event/${event.id}`}
                            className="btn btn-outline-primary btn-sm fw-semibold px-3"
                          >
                            View Details{" "}
                            <FontAwesomeIcon icon={["fas", "arrow-right"]} />
                          </Link>
                        </div>
                      </div>
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
