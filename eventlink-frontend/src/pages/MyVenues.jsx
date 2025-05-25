import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import eventsPlaceImg from "../assets/images/events-place.jpg";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MyVenues = () => {
  const { user } = useContext(AuthContext);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyVenues = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/venues/venues/my-registrations",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRegistrations(res.data.registrations || []);
      } catch (err) {
        setError("Failed to load your registered venues.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyVenues();
  }, []);

  return (
    <div
      className="container py-5 min-vh-100"
      style={{ background: "#f8f9fa" }}
    >
      <div className="mb-4 text-center">
        <h1 className="fw-bold text-primary mb-2">
          <FontAwesomeIcon icon={["fas", "building"]} className="me-2" />
          My Registered Venues
        </h1>
        <p className="text-secondary mb-0">
          All venues you have booked or registered for.
        </p>
      </div>
      {loading ? (
        <div className="text-center py-5">Loading your venues...</div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : registrations.length === 0 ? (
        <div className="alert alert-info text-center">
          You have not booked any venues yet.
        </div>
      ) : (
        <div className="row g-4">
          {registrations.map((reg) => (
            <div
              className="col-md-6 col-lg-4 d-flex align-items-stretch"
              key={reg.id}
            >
              <div className="card shadow-lg border-0 w-100 animate__animated animate__fadeInUp">
                <img
                  src={reg.venue?.image_url || eventsPlaceImg}
                  className="card-img-top object-fit-cover border-bottom"
                  alt={reg.venue?.name}
                  style={{
                    minHeight: 220,
                    maxHeight: 260,
                    objectFit: "cover",
                    borderTopLeftRadius: 18,
                    borderTopRightRadius: 18,
                  }}
                  onError={(e) => (e.target.src = eventsPlaceImg)}
                />
                <div className="card-body d-flex flex-column h-100">
                  <span className="badge bg-info text-dark mb-2">
                    {reg.venue?.venue_type || "Venue"}
                  </span>
                  <h5
                    className="card-title fw-bold mb-2"
                    style={{ fontSize: "1.25rem" }}
                  >
                    {reg.venue?.name}
                  </h5>
                  <div className="mb-2 text-muted small">
                    <span className="me-2">
                      <FontAwesomeIcon
                        icon={["fas", "map-marker-alt"]}
                        className="me-1"
                      />
                      {reg.venue?.city}, {reg.venue?.country}
                    </span>
                    <span className="me-2">
                      <FontAwesomeIcon
                        icon={["fas", "people-group"]}
                        className="me-1"
                      />
                      {reg.venue?.guest_capacity} guests
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="badge bg-success me-2">
                      {reg.venue?.availability ? "Available" : "Unavailable"}
                    </span>
                    {!reg.venue?.availability && (
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
                  <div className="mb-2">
                    <FontAwesomeIcon
                      icon={["fas", "calendar"]}
                      className="me-2 text-primary"
                    />
                    <span className="fw-semibold">Dates:</span> {reg.start_date}{" "}
                    to {reg.end_date}
                  </div>
                  <div className="mt-auto">
                    <Link
                      to={`/venue/${reg.venue_id}`}
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
          ))}
        </div>
      )}
    </div>
  );
};

export default MyVenues;
