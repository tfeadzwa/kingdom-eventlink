import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, Link } from "react-router-dom";
import "../styles/Register.css"; // Reuse the same CSS for consistent styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      alert("All fields are required.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    const token = searchParams.get("token");
    if (!token) {
      setMessage("Invalid or missing token.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        {
          token,
          newPassword,
        }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to reset password.");
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
              <svg
                width="32"
                height="32"
                fill="currentColor"
                className="text-primary"
              >
                <use href="#key" />
              </svg>
            </span>
          </div>
          <h2
            className="register-title fw-bold text-primary mb-1"
            style={{ fontSize: "2rem" }}
          >
            Reset Password
          </h2>
          <p className="text-secondary mb-0" style={{ fontSize: "1.1rem" }}>
            Set a new password for your account
          </p>
        </div>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group mb-3">
            <label htmlFor="newPassword" className="fw-semibold mb-1">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              className="form-control form-control-lg"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="confirmPassword" className="fw-semibold mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control form-control-lg"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            className="register-button btn btn-primary btn-lg w-100 fw-bold shadow-sm"
          >
            Reset Password
          </button>
        </form>
        {message && (
          <p className="register-footer mt-3 mb-0 text-secondary">{message}</p>
        )}
        <p className="register-footer mt-4 mb-0 text-secondary">
          Remembered your password?{" "}
          <Link to="/login" className="fw-semibold text-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
