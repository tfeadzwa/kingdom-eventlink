import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import eventsPlaceImg from "../assets/images/events-place.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { AuthContext } from "../context/AuthContext";
import notify from "../components/Notify.jsx";

const VenueDetails = () => {
  const { venueId } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [booking, setBooking] = useState({
    start_date: "",
    end_date: "",
    notes: "",
  });
  const [bookingStatus, setBookingStatus] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/venues/venues/${venueId}`
        );
        setVenue(res.data.venue);
      } catch (err) {
        setError("Failed to load venue details.");
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [venueId]);

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBooking((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingStatus("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `http://localhost:5000/api/venues/venues/${venue.id}/book`,
        booking,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookingStatus(res.data.message || "Booking request submitted.");
      notify.success(res.data.message || "Booking request submitted.");
      setBooking({ start_date: "", end_date: "", notes: "" });
    } catch (err) {
      setBookingStatus(err.response?.data?.message || "Failed to book venue.");
      notify.error(err.response?.data?.message || "Failed to book venue.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading)
    return (
      <div
        className="text-center py-5 min-vh-100 min-vw-100"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        Loading venue details...
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
  if (!venue) return null;

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
            venue.image_url
              ? venue.image_url.startsWith("http")
                ? venue.image_url
                : `/uploads/venues/${venue.image_url}`
              : eventsPlaceImg
          }
          alt={venue.name}
          className="w-100 object-fit-cover"
          style={{
            minHeight: 380,
            maxHeight: 480,
            objectFit: "cover",
            filter: "brightness(0.93)",
          }}
          onError={(e) => (e.target.src = eventsPlaceImg)}
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
                    {venue.name}
                  </h2>
                  <div className="mb-2 text-muted small">
                    <span className="me-3">
                      <FontAwesomeIcon
                        icon={["fas", "building"]}
                        className="me-1"
                      />
                      {venue.venue_type || "Venue"}
                    </span>
                    <span className="me-3">
                      <FontAwesomeIcon
                        icon={["fas", "map-marker-alt"]}
                        className="me-1"
                      />
                      {venue.city}, {venue.country}
                    </span>
                    <span className="me-3">
                      <FontAwesomeIcon
                        icon={["fas", "people-group"]}
                        className="me-1"
                      />
                      {venue.guest_capacity} guests
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="badge bg-info text-dark me-2">
                      {venue.venue_type || "Venue"}
                    </span>
                    <span className="badge bg-success me-2">
                      {venue.availability ? "Available" : "Unavailable"}
                    </span>
                    <span className="badge bg-secondary">
                      {venue.status?.charAt(0).toUpperCase() +
                        venue.status?.slice(1)}
                    </span>
                  </div>
                  <div className="mb-2 text-muted small">
                    <span className="me-3">
                      <FontAwesomeIcon
                        icon={["fas", "map-marker-alt"]}
                        className="me-1"
                      />
                      {venue.address || "-"}
                    </span>
                    <span>
                      <FontAwesomeIcon
                        icon={["fas", "globe"]}
                        className="me-1"
                      />
                      {venue.country || "-"}, {venue.state || "-"},{" "}
                      {venue.city || "-"}
                    </span>
                  </div>
                </div>
                <div className="d-flex flex-column align-items-end gap-2">
                  <Link
                    to="/browse-venues"
                    className="btn btn-outline-secondary mb-2"
                  >
                    <FontAwesomeIcon
                      icon={["fas", "arrow-left"]}
                      className="me-1"
                    />{" "}
                    Browse Venues
                  </Link>
                  <a
                    href="#book"
                    className="btn btn-primary btn-lg fw-bold shadow-sm rounded-pill px-4"
                  >
                    <FontAwesomeIcon
                      icon={["fas", "calendar-check"]}
                      className="me-2"
                    />
                    Book Venue
                  </a>
                </div>
              </div>
              <div className="mb-3" style={{ fontSize: "1.13rem" }}>
                {venue.description}
              </div>
              {venue.amenities && (
                <div className="alert alert-light border mb-3">
                  <strong>Amenities:</strong>
                  <div>{venue.amenities}</div>
                </div>
              )}
            </div>
          </div>

          {/* Pricing & Contact Section */}
          <div className="col-12">
            <div className="card shadow-sm border-0 p-4 mb-4 animate__animated animate__fadeInUp">
              <h4 className="fw-bold mb-3">
                <FontAwesomeIcon
                  icon={["fas", "money-bill-wave"]}
                  className="me-2 text-primary"
                />
                Pricing & Contact
              </h4>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="mb-2">
                    <span className="fw-semibold">Price Per Hour: </span>
                    {venue.price_per_hour ? (
                      <span className="text-success">
                        ${venue.price_per_hour} {venue.price_currency}
                      </span>
                    ) : (
                      <span className="text-muted">N/A</span>
                    )}
                  </div>
                  <div className="mb-2">
                    <span className="fw-semibold">Price Per Day: </span>
                    {venue.price_per_day ? (
                      <span className="text-success">
                        ${venue.price_per_day} {venue.price_currency}
                      </span>
                    ) : (
                      <span className="text-muted">N/A</span>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-2">
                    <FontAwesomeIcon
                      icon={["fas", "envelope"]}
                      className="me-2"
                    />
                    <span className="fw-semibold">Email: </span>
                    {venue.contact_email || (
                      <span className="text-muted">N/A</span>
                    )}
                  </div>
                  <div className="mb-2">
                    <FontAwesomeIcon icon={["fas", "phone"]} className="me-2" />
                    <span className="fw-semibold">Phone: </span>
                    {venue.contact_phone || (
                      <span className="text-muted">N/A</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Book Venue Section */}
          <div className="col-12" id="book">
            <div className="card shadow-sm border-0 p-4 animate__animated animate__fadeInUp">
              <h4 className="fw-bold mb-3">
                <FontAwesomeIcon
                  icon={["fas", "calendar-check"]}
                  className="me-2 text-primary"
                />
                Book This Venue
              </h4>
              {user ? (
                <form onSubmit={handleBookingSubmit} className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">Start Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="start_date"
                      value={booking.start_date}
                      onChange={handleBookingChange}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">End Date</label>
                    <input
                      type="date"
                      className="form-control"
                      name="end_date"
                      value={booking.end_date}
                      onChange={handleBookingChange}
                      required
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Notes (optional)
                    </label>
                    <textarea
                      className="form-control"
                      name="notes"
                      value={booking.notes}
                      onChange={handleBookingChange}
                      rows={2}
                      placeholder="Any special requirements or message for the venue?"
                    ></textarea>
                  </div>
                  <div className="col-12 d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-primary px-4 fw-bold"
                      disabled={bookingLoading}
                    >
                      {bookingLoading ? "Booking..." : "Submit Booking Request"}
                    </button>
                  </div>
                  {bookingStatus && (
                    <div className="col-12">
                      <div className="alert alert-info mt-3 text-center">
                        {bookingStatus}
                      </div>
                    </div>
                  )}
                </form>
              ) : (
                <div className="alert alert-info mb-0">
                  Please <Link to="/login">log in</Link> to book this venue.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
