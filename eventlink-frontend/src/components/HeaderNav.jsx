import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/HeaderNav.css";

const HeaderNav = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-2 px-3 sticky-top"
      style={{ zIndex: 1040 }}
    >
      <div className="container-fluid" style={{ maxWidth: 1400 }}>
        <Link
          to="/"
          className="navbar-brand fw-bold fs-3 text-primary d-flex align-items-center gap-2"
        >
          <FontAwesomeIcon
            icon={["fas", "calendar-plus"]}
            className="me-2 text-primary"
          />
          EventLink
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <li className="nav-item">
              <Link to="/browse-events" className="nav-link fw-semibold">
                <FontAwesomeIcon
                  icon={["fas", "calendar-plus"]}
                  className="me-1"
                />{" "}
                Browse Events
              </Link>
            </li>
            {user ? (
              <li className="nav-item dropdown">
                <button
                  className="btn nav-link dropdown-toggle d-flex align-items-center gap-2 border-0 bg-transparent fw-semibold"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <span>{user.name || "My Profile"}</span>
                  {user.role === "admin" ? (
                    <FontAwesomeIcon
                      icon={["fas", "user-shield"]}
                      className="text-primary"
                    />
                  ) : (
                    <FontAwesomeIcon icon={["fas", "caret-down"]} />
                  )}
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end mt-2 shadow-sm"
                  aria-labelledby="userDropdown"
                >
                  {user.role === "admin" && (
                    <>
                      <li>
                        <Link to="/admin" className="dropdown-item">
                          <FontAwesomeIcon
                            icon={["fas", "shield-halved"]}
                            className="me-2 text-primary"
                          />{" "}
                          Admin Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link to="/create-event" className="dropdown-item">
                          <FontAwesomeIcon
                            icon={["fas", "calendar-plus"]}
                            className="me-2 text-success"
                          />{" "}
                          Create Event
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/admin/create-ticket"
                          className="dropdown-item"
                        >
                          <FontAwesomeIcon
                            icon={["fa", "ticket"]}
                            className="me-2 text-info"
                          />{" "}
                          Create Ticket
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                    </>
                  )}
                  <li>
                    <Link to="/profile" className="dropdown-item">
                      <FontAwesomeIcon
                        icon={["fas", "user"]}
                        className="me-2"
                      />{" "}
                      View Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/settings" className="dropdown-item">
                      <FontAwesomeIcon
                        icon={["fas", "gear"]}
                        className="me-2"
                      />{" "}
                      Account Settings
                    </Link>
                  </li>
                  <li>
                    <Link to="/notifications" className="dropdown-item">
                      <FontAwesomeIcon
                        icon={["fas", "bell"]}
                        className="me-2"
                      />{" "}
                      Notifications
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      onClick={logout}
                      className="dropdown-item text-danger d-flex align-items-center gap-2"
                      type="button"
                    >
                      <FontAwesomeIcon
                        icon={["fas", "right-from-bracket"]}
                        className="me-2"
                      />{" "}
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link fw-semibold">
                    <FontAwesomeIcon
                      icon={["fas", "right-to-bracket"]}
                      className="me-1"
                    />{" "}
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/register"
                    className="btn btn-primary ms-lg-2 px-3 fw-semibold"
                  >
                    <FontAwesomeIcon
                      icon={["fas", "user-plus"]}
                      className="me-1"
                    />{" "}
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default HeaderNav;
