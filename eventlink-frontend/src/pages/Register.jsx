import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import notify from "../components/Notify.jsx";
import "../styles/Register.css"; // Reuse the same CSS for consistent styling

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      notify.error("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      notify.error("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
        }
      );
      notify.success("Registration successful! Redirecting to login page...");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      notify.error(error.response?.data?.message || "Registration failed");
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
                <use href="#user-plus" />
              </svg>
            </span>
          </div>
          <h2
            className="register-title fw-bold text-primary mb-1"
            style={{ fontSize: "2rem" }}
          >
            Create Your Account
          </h2>
          <p className="text-secondary mb-0" style={{ fontSize: "1.1rem" }}>
            Join EventLink and start your event journey!
          </p>
        </div>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group mb-3">
            <label htmlFor="name" className="fw-semibold mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              className="form-control form-control-lg"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
          <div className="form-group mb-3">
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
          <div className="form-group mb-3">
            <label htmlFor="password" className="fw-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="form-control form-control-lg"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            className="register-button btn btn-primary btn-lg w-100 fw-bold shadow-sm"
          >
            Sign Up
          </button>
        </form>
        <p className="register-footer mt-4 mb-0 text-secondary">
          Already have an account?{" "}
          <Link to="/login" className="fw-semibold text-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
