import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/Home.css";
import eventsHomeImg from "../assets/images/events-home.png";
import axios from "axios";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/events");
        setEvents(res.data.events?.slice(0, 3) || []); // Show only 3 featured events
      } catch (err) {
        setError("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    const fetchVenues = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/venues/venues");
        setVenues(res.data.venues?.slice(0, 3) || []); // Show only 3 featured venues
      } catch (err) {
        // Optionally handle venue error
      }
    };
    fetchEvents();
    fetchVenues();
  }, []);

  return (
    <div
      className="home-hero bg-light min-vh-100 d-flex flex-column justify-content-center p-0"
      style={{ background: "#f8f9fa" }}
    >
      <div className="container py-5" style={{ maxWidth: 1400 }}>
        <div className="row align-items-center g-5 mb-5 flex-lg-row flex-column-reverse">
          <div className="col-lg-6 order-2 order-lg-1 d-flex flex-column justify-content-center">
            <h1
              className="display-3 fw-bold mb-3 text-primary"
              style={{ letterSpacing: "-1px" }}
            >
              Welcome to Masvingo Eventlink
            </h1>
            <p
              className="lead text-secondary mb-4"
              style={{ maxWidth: 540, fontSize: "1.25rem" }}
            >
              Discover, create, and manage events with ease. Join a vibrant
              community, explore upcoming events, and never miss out on
              experiences that matter to you.
            </p>
            <div className="d-flex flex-wrap gap-3 mb-4">
              {/* <Link
                to="/browse-events"
                className="btn btn-primary btn-lg px-4 d-flex align-items-center gap-2 fw-semibold shadow-sm"
              >
                <FontAwesomeIcon icon={["fas", "calendar-plus"]} /> Browse
                Events
              </Link> */}
              <Link
                to="/browse-venues"
                className="btn btn-primary btn-lg px-4 d-flex align-items-center gap-2 fw-semibold shadow-sm"
              >
                <FontAwesomeIcon icon={["fas", "calendar-plus"]} /> Browse
                Venues
              </Link>
              <Link
                to="/register"
                className="btn btn-outline-primary btn-lg px-4 d-flex align-items-center gap-2 fw-semibold shadow-sm"
              >
                <FontAwesomeIcon icon={["fas", "user-plus"]} /> Sign Up
              </Link>
            </div>
            <div className="d-flex align-items-center gap-3 mt-2">
              <FontAwesomeIcon
                icon={["fas", "shield-halved"]}
                className="text-success fs-4"
              />
              <span className="text-muted small">
                Secure, reliable, and community-driven event management
              </span>
            </div>
          </div>
          <div className="col-lg-6 order-1 order-lg-2 text-center d-flex justify-content-center align-items-center">
            <div className="w-100">
              <img
                src={eventsHomeImg}
                alt="EventLink Home"
                className="img-fluid rounded shadow-lg border border-2 border-primary-subtle"
                style={{ maxHeight: 420, objectFit: "cover", width: "90%" }}
              />
            </div>
          </div>
        </div>
        {/* <div className="row mb-4">
          <div className="col-12 text-start">
            <h2
              className="fw-bold mb-3 text-primary"
              style={{ fontSize: "2.5rem", letterSpacing: "-1px" }}
            >
              Featured Events
            </h2>
            <p className="text-secondary mb-4" style={{ fontSize: "1.25rem" }}>
              Check out some of our most exciting upcoming events!
            </p>
          </div>
        </div>
        <div className="row g-4">
          {loading ? (
            <div className="col-12 text-center py-4">Loading events...</div>
          ) : error ? (
            <div className="col-12 text-danger py-4">{error}</div>
          ) : events.length === 0 ? (
            <div className="col-12 text-center py-4">No events found.</div>
          ) : (
            events.map((event) => (
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
                        <FontAwesomeIcon
                          icon={["fas", "calendar-plus"]}
                          className="me-1 text-primary"
                        />
                        {event.start_date
                          ? new Date(event.start_date).toLocaleDateString()
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
        </div> */}
        {/* Featured Venues Section */}
        <div className="row mb-4">
          <div className="col-12 text-start">
            <h2
              className="fw-bold mb-3 text-primary"
              style={{ fontSize: "2.5rem", letterSpacing: "-1px" }}
            >
              Featured Venues
            </h2>
            <p className="text-secondary mb-4" style={{ fontSize: "1.25rem" }}>
              Discover some of our top venues for your next event!
            </p>
          </div>
        </div>
        <div className="row g-4">
          {loading ? (
            <div className="col-12 text-center py-4">Loading venues...</div>
          ) : error ? (
            <div className="col-12 text-danger py-4">{error}</div>
          ) : venues.length === 0 ? (
            <div className="col-12 text-center py-4">No venues found.</div>
          ) : (
            venues.map((venue) => (
              <div
                className="col-md-6 col-lg-4 d-flex align-items-stretch"
                key={venue.id}
              >
                <div className="card shadow-lg border-0 w-100 h-100 animate__animated animate__fadeInUp">
                  <img
                    src={venue.image_url || eventsHomeImg}
                    className="card-img-top object-fit-cover border-bottom"
                    alt={venue.name}
                    style={{
                      minHeight: 220,
                      maxHeight: 260,
                      objectFit: "cover",
                      borderTopLeftRadius: 18,
                      borderTopRightRadius: 18,
                    }}
                    onError={(e) => (e.target.src = eventsHomeImg)}
                  />
                  <div className="card-body d-flex flex-column h-100">
                    <span className="badge bg-info text-dark mb-2">
                      {venue.venue_type || "Venue"}
                    </span>
                    <h5
                      className="card-title fw-bold mb-2"
                      style={{ fontSize: "1.25rem" }}
                    >
                      {venue.name}
                    </h5>
                    <div className="mb-2 text-muted small">
                      <span className="me-2">
                        <i className="bi bi-geo-alt-fill me-1"></i>
                        {venue.city}, {venue.country}
                      </span>
                      <span className="me-2">
                        <i className="bi bi-people-fill me-1"></i>
                        {venue.guest_capacity} guests
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="badge bg-success me-2">
                        {venue.availability ? "Available" : "Unavailable"}
                      </span>
                      <span className="badge bg-secondary me-2">
                        {venue.status?.charAt(0).toUpperCase() +
                          venue.status?.slice(1)}
                      </span>
                      {!venue.availability && (
                        <span
                          className="badge bg-danger fw-bold"
                          style={{
                            fontSize: "1rem",
                            fontWeight: 700,
                            letterSpacing: 0.5,
                          }}
                        >
                          <span style={{ color: "#fff", fontWeight: 700 }}>
                            Booked
                          </span>
                        </span>
                      )}
                    </div>
                    <p
                      className="card-text mb-2"
                      style={{ fontSize: "1.05rem", color: "#444" }}
                    >
                      {venue.description?.slice(0, 90)}
                      {venue.description && venue.description.length > 90
                        ? "..."
                        : ""}
                    </p>
                    <div className="mt-auto">
                      <Link
                        to={`/venue/${venue.id}`}
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

export default Home;
