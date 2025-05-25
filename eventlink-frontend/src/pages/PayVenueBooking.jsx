import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import eventsPlaceImg from "../assets/images/events-place.jpg";

const PayVenueBooking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { venueId } = useParams();
  const {
    bookingDetails = {},
    total = 0,
    venueName = "",
    venueImage = "",
    bookingDates = {},
  } = location.state || {};
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [loading, setLoading] = useState(false);

  // When user clicks PayNow, register booking and show success
  const handlePayNowClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    setBookingError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/venues/venues/${venueId}/book`,
        bookingDetails,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookingSuccess(true);
      setTimeout(() => {
        navigate(`/venue/${venueId}`);
      }, 2000);
      // Open PayNow in new tab
      window.open(
        `https://www.paynow.co.zw/Payment/BillPaymentLink/?q=aWQ9MjEwMDcmYW1vdW50PTI1MC4wMCZhbW91bnRfcXVhbnRpdHk9MC4wMCZsPTE%3d`,
        "_blank"
      );
    } catch (err) {
      if (err.response && err.response.status === 409) {
        // Venue is already booked for the selected dates
        const { booked, next_available } = err.response.data;
        setBookingError(
          <div>
            <div>Venue is already booked for the selected dates.</div>
            <div className="mt-2">
              <strong>Booked date ranges:</strong>
              <ul>
                {booked &&
                  booked.map((range, idx) => (
                    <li key={idx}>
                      {range.start_date} to {range.end_date}
                    </li>
                  ))}
              </ul>
              <div>
                <strong>Next available from:</strong> {next_available}
              </div>
            </div>
          </div>
        );
      } else {
        setBookingError(err.response?.data?.message || err.message);
      }
    }
    setLoading(false);
  };

  return (
    <div
      className="container-fluid px-0"
      style={{ background: "#f8f9fa", minHeight: "100vh" }}
    >
      {/* Top venue image with gradient overlay */}
      <div
        className="position-relative w-100"
        style={{ minHeight: 380, maxHeight: 480, overflow: "hidden" }}
      >
        <img
          src={venueImage || eventsPlaceImg}
          alt={venueName}
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
            <div
              className="card shadow-lg border-0 p-4 animate__animated animate__fadeInUp"
              style={{ borderRadius: 36 }}
            >
              <div className="row w-100 overflow-hidden">
                {/* Left summary */}
                <div
                  className="col-md-5 d-flex flex-column justify-content-between p-5 text-white"
                  style={{
                    background:
                      "linear-gradient(135deg,rgb(92, 98, 210) 0%,rgb(220, 167, 228) 100%)",
                    minHeight: 520,
                    borderRadius: 36,
                  }}
                >
                  <div>
                    <button
                      className="btn btn-link text-white mb-4 p-0"
                      onClick={() => navigate(-1)}
                    >
                      &larr; Back
                    </button>
                    <h4 className="fw-bold mb-3">Venue Booking Payment</h4>
                    <h1 className="display-5 fw-bold mb-2">${total}</h1>
                    <div className="mb-3">
                      Pay for your venue booking securely with PayNow.
                    </div>
                    <div className="bg-white text-dark rounded p-3 mb-2">
                      <div className="fw-semibold">Venue:</div>
                      <div className="small">{venueName}</div>
                    </div>
                    {bookingDates && (
                      <div className="mb-2">
                        <span className="fw-semibold">Dates: </span>
                        <span>
                          {bookingDates.start_date} to {bookingDates.end_date}
                        </span>
                      </div>
                    )}
                    <div className="d-flex justify-content-between mt-4">
                      <span className="fw-semibold">Total due today</span>
                      <span className="fw-bold">${total}</span>
                    </div>
                  </div>
                  <div className="text-center mt-5">
                    <img
                      src="/src/assets/images/paynow-logo-blue.svg"
                      alt="PayNow"
                      style={{ maxWidth: 120 }}
                    />
                  </div>
                </div>
                {/* Right payment form */}
                <div
                  className="col-md-7 bg-white p-5 d-flex flex-column align-items-center justify-content-center"
                  style={{ borderRadius: 36, minHeight: 520 }}
                >
                  <h5 className="mb-4 fw-bold text-primary">
                    Payment Information
                  </h5>
                  <a
                    href="https://www.paynow.co.zw/Payment/BillPaymentLink/?q=aWQ9MjEwMDQmYW1vdW50PTEwLjAwJmFtb3VudF9xdWFudGl0eT0wLjAwJmw9MQ%3d%3d"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handlePayNowClick}
                    className="mb-3"
                  >
                    <img
                      src="https://www.paynow.co.zw/Content/Buttons/Medium_buttons/button_pay-now_medium.png"
                      alt="Pay Now"
                      style={{ border: 0 }}
                    />
                  </a>
                  {loading && (
                    <div className="alert alert-info mt-3">
                      Processing booking...
                    </div>
                  )}
                  {bookingSuccess && (
                    <div className="alert alert-success mt-3">
                      Booking successful! Redirecting to venue details...
                    </div>
                  )}
                  {bookingError && (
                    <div className="alert alert-danger mt-3">
                      {typeof bookingError === "string" ? (
                        bookingError
                      ) : (
                        <>{bookingError}</>
                      )}
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

export default PayVenueBooking;
