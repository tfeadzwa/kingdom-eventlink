import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, Link } from "react-router-dom";
import "../styles/Register.css"; // Reuse the same CSS for consistent styling

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setMessage("Invalid or missing verification token.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/auth/verify-email?token=${token}`
        );
        setMessage(response.data.message);
      } catch (error) {
        setMessage(
          error.response?.data?.message ||
            "Failed to verify email. Please try again."
        );
      }
    };

    verifyEmail();
  }, [searchParams]);

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
                <use href="#envelope-circle-check" />
              </svg>
            </span>
          </div>
          <h2
            className="register-title fw-bold text-primary mb-1"
            style={{ fontSize: "2rem" }}
          >
            Email Verification
          </h2>
        </div>
        <p className="register-footer mt-3 mb-0 text-secondary">{message}</p>
        <p className="register-footer mt-4 mb-0 text-secondary">
          Go back to{" "}
          <Link to="/login" className="fw-semibold text-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
