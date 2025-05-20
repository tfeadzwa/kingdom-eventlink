import React from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

const adminFeatures = [
  {
    icon: "bi-calendar-plus",
    title: "Create Event",
    desc: "Add new events for users to register and attend.",
    link: "/create-event",
    btn: "Create Event",
    color: "primary",
  },
  {
    icon: "bi-tags",
    title: "Create Category",
    desc: "Add new event categories for better event organization.",
    link: "/admin/create-category",
    btn: "Create Category",
    color: "info",
  },
  {
    icon: "bi-people",
    title: "Manage Users",
    desc: "View, edit, or remove users from the platform.",
    link: "/admin/manage-users",
    btn: "Manage Users",
    color: "secondary",
  },
  {
    icon: "bi-bar-chart-line",
    title: "View Analytics",
    desc: "See event stats, ticket sales, and user activity.",
    link: "/admin/view-analytics",
    btn: "View Analytics",
    color: "success",
  },
  {
    icon: "bi-x-octagon",
    title: "Event Cancellation",
    desc: "Cancel events and manage refunds for attendees.",
    link: "/admin/event-cancellation",
    btn: "Event Cancellation",
    color: "danger",
  },
];

const AdminDashboard = () => {
  return (
    <div
      className="container-fluid min-vh-100 min-vw-100 d-flex flex-column align-items-center justify-content-center p-0"
      style={{ background: "#f8f9fa" }}
    >
      <div className="container py-5" style={{ maxWidth: 1200 }}>
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-2 text-primary">
            Admin Dashboard
          </h1>
          <p
            className="lead text-secondary mb-0"
            style={{ maxWidth: 600, margin: "0 auto" }}
          >
            Manage events, users, analytics, and more from your admin panel. Use
            the quick actions below to get started.
          </p>
        </div>
        <div className="row g-4">
          {adminFeatures.map((f, idx) => (
            <div
              className="col-12 col-md-6 col-lg-4 d-flex align-items-stretch"
              key={f.title}
            >
              <div
                className={`card shadow border-0 w-100 h-100 animate__animated animate__fadeInUp animate__delay-${
                  idx + 1
                }s`}
                style={{ minHeight: 320 }}
              >
                <div className="card-body d-flex flex-column p-4">
                  <div className={`mb-3 display-5 text-${f.color}`}>
                    <i className={`bi ${f.icon}`}></i>
                  </div>
                  <h5 className="card-title fw-bold mb-2">{f.title}</h5>
                  <p className="card-text flex-grow-1 text-secondary mb-3">
                    {f.desc}
                  </p>
                  <Link
                    to={f.link}
                    className={`btn btn-${f.color} btn-lg w-100 mt-auto`}
                  >
                    {f.btn} <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
