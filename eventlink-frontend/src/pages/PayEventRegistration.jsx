import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import eventsHomeImg from "../assets/images/events-hole.jpg";

const PayEventRegistration = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { eventId } = useParams();
  const {
    tickets = [],
    total = 0,
    eventTitle = "",
    eventImage = "",
  } = location.state || {};
  const [phone, setPhone] = useState("");
  const [instructions, setInstructions] = useState("");
  const [reference, setReference] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setInstructions("");
    setStatus("");
    try {
      // 1. Register the user for the event and tickets
      const token = localStorage.getItem("token");
      const regRes = await axios.post(
        `http://localhost:5000/api/auth/events/${eventId}/register`,
        { tickets },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      let registration_id =
        regRes.data.registrationId || regRes.data.registration_id;
      if (
        Array.isArray(regRes.data.registrationIds) &&
        regRes.data.registrationIds.length > 0
      ) {
        registration_id = regRes.data.registrationIds[0];
      }
      // 2. Initiate payment with the real registration_id
      const payRes = await axios.post(
        "http://localhost:5000/api/payments/initiate",
        {
          registration_id,
          amount: total,
          phone,
          tickets,
        }
      );
      setInstructions(payRes.data.instructions);
      setReference(payRes.data.reference);
      setStatus("Pending");
    } catch (err) {
      setStatus("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  const checkStatus = async () => {
    if (!reference) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/payments/${reference}/status`);
      setStatus(res.data.status);
    } catch (err) {
      setStatus("Error: " + (err.response?.data?.error || err.message));
    }
    setLoading(false);
  };

  return (
    <div
      className="container-fluid px-0"
      style={{ background: "#f8f9fa", minHeight: "100vh" }}
    >
      {/* Top event image with gradient overlay, matching EventDetails */}
      <div
        className="position-relative w-100"
        style={{ minHeight: 380, maxHeight: 480, overflow: "hidden" }}
      >
        <img
          src={eventImage || eventsHomeImg}
          alt={eventTitle}
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
                    <h4 className="fw-bold mb-3">Event Registration Payment</h4>
                    <h1 className="display-5 fw-bold mb-2">${total}</h1>
                    <div className="mb-3">
                      Pay for your event registration securely with Ecocash via
                      PayNow.
                    </div>
                    <div className="bg-white text-dark rounded p-3 mb-2">
                      <div className="fw-semibold">Event:</div>
                      <div className="small">{eventTitle}</div>
                    </div>
                    <div className="mb-2">
                      {tickets.map((ticket, idx) => (
                        <div
                          key={idx}
                          className="d-flex justify-content-between align-items-center"
                        >
                          <span className="fw-semibold text-white">
                            {ticket.quantity} x {ticket.type}
                          </span>
                          <span className="fw-bold text-white">
                            $
                            {(Number(ticket.price) * ticket.quantity).toFixed(
                              2
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
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
                  className="col-md-7 bg-white p-5"
                  style={{ borderRadius: 36 }}
                >
                  <h5 className="mb-4 fw-bold text-primary">
                    Payment Information
                  </h5>
                  <form onSubmit={handlePayment} className="mb-3">
                    <div className="mb-3">
                      <label className="form-label">Ecocash Phone Number</label>
                      <input
                        type="text"
                        className="form-control"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 0771234567"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary w-100"
                      disabled={loading}
                    >
                      {loading ? "Processing..." : "Pay Now"}
                    </button>
                  </form>
                  {instructions && (
                    <div className="alert alert-info mt-4">
                      <h6>Payment Instructions</h6>
                      <pre className="mb-2">{instructions}</pre>
                      <button
                        onClick={checkStatus}
                        className="btn btn-outline-primary btn-sm"
                        disabled={loading}
                      >
                        {loading ? "Checking..." : "Check Payment Status"}
                      </button>
                    </div>
                  )}
                  {status && (
                    <div
                      className={`alert mt-3 ${
                        status === "Paid" ? "alert-success" : "alert-warning"
                      }`}
                    >
                      Status: {status}
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

export default PayEventRegistration;
