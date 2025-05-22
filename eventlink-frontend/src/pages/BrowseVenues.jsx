import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import eventsPlaceImg from "../assets/images/events-place.jpg";

const BrowseVenues = () => {
  const [venues, setVenues] = useState([]);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/venues/venues");
        setVenues(res.data.venues || []);
      } catch (err) {
        setError("Failed to load venues.");
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  const filteredVenues = venues.filter((venue) => {
    const matchesSearch = venue.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCity = city ? venue.city === city : true;
    return matchesSearch && matchesCity;
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
              Browse Venues
            </h1>
            <p className="text-secondary mb-3" style={{ fontSize: "1.15rem" }}>
              Discover and book the perfect venue for your event.
            </p>
          </div>
        </div>
        <div className="row mb-4 g-2">
          <div className="col-lg-4 col-md-6 col-12 mb-2 mb-lg-0">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Search by venue name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-lg-3 col-md-6 col-12 mb-2 mb-lg-0">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Filter by city..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>
        <div className="row g-4 mt-2">
          {loading ? (
            <div className="col-12 text-center py-4">Loading venues...</div>
          ) : error ? (
            <div className="col-12 text-danger py-4">{error}</div>
          ) : filteredVenues.length === 0 ? (
            <div className="col-12 text-center py-4">No venues found.</div>
          ) : (
            filteredVenues.map((venue) => (
              <div
                className="col-md-6 col-lg-4 d-flex align-items-stretch"
                key={venue.id}
              >
                <div className="card shadow-lg border-0 w-100 h-100 animate__animated animate__fadeInUp">
                  <img
                    src={venue.image_url || eventsPlaceImg}
                    className="card-img-top object-fit-cover border-bottom"
                    alt={venue.name}
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
                      <span className="badge bg-secondary">
                        {venue.status?.charAt(0).toUpperCase() +
                          venue.status?.slice(1)}
                      </span>
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
                        <i className="bi bi-arrow-right me-1"></i>
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

export default BrowseVenues;
