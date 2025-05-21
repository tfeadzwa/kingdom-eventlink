import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import notify from "../components/Notify.jsx";
import "../styles/Register.css"; // Reuse the same CSS for consistent styling
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      notify.error("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );

      const userData = response.data;
      login(userData); // update global auth state

      notify.success("Login successful!");

      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      notify.error(error.response?.data?.message || "Login failed");
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
                icon={["fas", "right-to-bracket"]}
                size="2x"
                className="text-primary"
              />
            </span>
          </div>
          <h2
            className="register-title fw-bold text-primary mb-1"
            style={{ fontSize: "2rem" }}
          >
            Welcome Back!
          </h2>
          <p className="text-secondary mb-0" style={{ fontSize: "1.1rem" }}>
            Sign in to your EventLink account
          </p>
        </div>
        <form onSubmit={handleSubmit} className="register-form">
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
          <div className="form-group mb-4">
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
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="register-button btn btn-primary btn-lg w-100 fw-bold shadow-sm"
          >
            Login
          </button>
        </form>
        <div className="text-center mt-3">
          <Link
            to="/forgot-password"
            className="text-decoration-none text-primary fw-semibold"
          >
            Forgot Password?
          </Link>
        </div>
        <p className="register-footer mt-4 mb-0 text-secondary">
          Don’t have an account?{" "}
          <Link to="/register" className="fw-semibold text-primary">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
