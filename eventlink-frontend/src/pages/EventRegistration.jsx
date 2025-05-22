import React, { useState } from "react";
import axios from "axios";

const EventRegistration = ({ registrationId, amount }) => {
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
      const res = await axios.post("/api/payments/initiate", {
        registration_id: registrationId,
        amount,
        phone,
      });
      setInstructions(res.data.instructions);
      setReference(res.data.reference);
      setStatus("Pending");
    } catch (err) {
      setStatus("Error: " + (err.response?.data?.error || err.message));
    }
    setLoading(false);
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
    <div>
      <h3>Pay for Registration</h3>
      <form onSubmit={handlePayment}>
        <label>Ecocash Phone Number:</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          Pay Now
        </button>
      </form>
      {instructions && (
        <div>
          <h4>Payment Instructions</h4>
          <pre>{instructions}</pre>
          <button onClick={checkStatus} disabled={loading}>
            Check Payment Status
          </button>
        </div>
      )}
      {status && <div>Status: {status}</div>}
    </div>
  );
};

export default EventRegistration;
