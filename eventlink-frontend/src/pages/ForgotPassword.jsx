import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/Register.css"; // Reuse the same CSS for consistent styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      alert("Email is required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        { email }
      );
      setMessage(
        response.data.message ||
          "Reset link sent successfully. Please check your email."
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Failed to send reset email. Please try again later.";
      setMessage(errorMessage);
    }
  };

  return (
    <div className="register-container bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div
        className="register-card shadow-lg border border-2 border-primary-subtle p-4 rounded-4 bg-white"
        style={{ maxWidth: 420, width: "100%" }}
      >
        <div className="mb-4 text-center">
          <div className="mb-2">
            <span className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-2">
              <FontAwesomeIcon
                icon={["fas", "envelope-open-text"]}
                size="2x"
                className="text-primary"
              />
            </span>
          </div>
          <h2
            className="register-title fw-bold text-primary mb-1"
            style={{ fontSize: "2rem" }}
          >
            Forgot Password
          </h2>
          <p className="text-secondary mb-0" style={{ fontSize: "1.1rem" }}>
            We'll send you a reset link
          </p>
        </div>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group mb-4">
            <label htmlFor="email" className="fw-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="form-control form-control-lg"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <button
            type="submit"
            className="register-button btn btn-primary btn-lg w-100 fw-bold shadow-sm"
          >
            Send Reset Link
          </button>
        </form>
        {message && (
          <p className="register-footer mt-3 mb-0 text-secondary">
            {message}
            {message.includes("Reset link sent successfully") && (
              <span>
                <br />
                <Link to="/login" className="fw-semibold text-primary">
                  Go to Login
                </Link>
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
