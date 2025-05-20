import React from "react";
import { Link } from "react-router-dom";
import "../styles/Dashboard.css";

const userFeatures = [
  {
    icon: "bi-calendar-event",
    title: "My Events",
    desc: "See all events you have registered for or are attending.",
    link: "/my-events",
    btn: "View My Events",
    color: "primary",
  },
  {
    icon: "bi-ticket-perforated",
    title: "My Tickets",
    desc: "Access your tickets and QR codes for upcoming events.",
    link: "/my-tickets",
    btn: "View Tickets",
    color: "info",
  },
  {
    icon: "bi-person-gear",
    title: "Account Settings",
    desc: "Update your profile, password, and notification preferences.",
    link: "/settings",
    btn: "Account Settings",
    color: "secondary",
  },
];

const Dashboard = () => {
  return (
    <div
      className="container-fluid min-vh-100 min-vw-100 d-flex flex-column align-items-center p-0"
      style={{ background: "#f8f9fa" }}
    >
      <div className="container py-5" style={{ maxWidth: 1200 }}>
        <div className="text-center mb-5">
          <span className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
            <svg
              width="40"
              height="40"
              fill="currentColor"
              className="text-primary"
            >
              <use href="#user" />
            </svg>
          </span>
          <h1 className="display-4 fw-bold mb-2 text-primary">
            User Dashboard
          </h1>
          <p
            className="lead text-secondary mb-0"
            style={{ maxWidth: 600, margin: "0 auto" }}
          >
            Welcome to your dashboard. View your events, tickets, and account
            details below.
          </p>
        </div>
        <div className="row g-4">
          {userFeatures.map((f, idx) => (
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
                    <svg
                      width="36"
                      height="36"
                      fill="currentColor"
                      className={`text-${f.color}`}
                    >
                      <use href={`#${f.icon.replace("bi-", "")}`} />
                    </svg>
                  </div>
                  <h5 className="card-title fw-bold mb-2">{f.title}</h5>
                  <p className="card-text flex-grow-1 text-secondary mb-3">
                    {f.desc}
                  </p>
                  <Link
                    to={f.link}
                    className={`btn btn-${f.color} btn-lg w-100 mt-auto`}
                  >
                    {f.btn}{" "}
                    <svg
                      width="18"
                      height="18"
                      fill="currentColor"
                      className="ms-1"
                    >
                      <use href="#arrow-right" />
                    </svg>
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

export default Dashboard;
