import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NotFound = () => (
  <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light text-center p-4">
    <FontAwesomeIcon
      icon={["fas", "triangle-exclamation"]}
      className="text-warning mb-4"
      style={{ fontSize: 80 }}
    />
    <h1 className="display-3 fw-bold mb-3">404</h1>
    <h2 className="mb-3 text-secondary">Page Not Found</h2>
    <p className="lead mb-4">
      Sorry, the page you are looking for does not exist or has been moved.
    </p>
    <Link to="/" className="btn btn-primary btn-lg px-4">
      <FontAwesomeIcon icon={["fas", "arrow-left"]} className="me-2" />
      Go Home
    </Link>
  </div>
);

export default NotFound;
