import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/Home.css";
import eventsHomeImg from "../assets/images/events-home.png";
import axios from "axios";

const Home = () => {
  const [events, setEvents] = useState([]);
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
    fetchEvents();
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
              Welcome to EventLink
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
              <Link
                to="/browse-events"
                className="btn btn-primary btn-lg px-4 d-flex align-items-center gap-2 fw-semibold shadow-sm"
              >
                <FontAwesomeIcon icon={["fas", "calendar-plus"]} /> Browse
                Events
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
        <div className="row mb-4">
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
        <div className="row mt-5">
          <div className="col-12 text-start">
            <Link
              to="/browse-events"
              className="btn btn-lg btn-outline-primary px-5 py-2 fw-semibold"
            >
              <FontAwesomeIcon
                icon={["fas", "calendar-plus"]}
                className="me-2"
              />
              View All Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
