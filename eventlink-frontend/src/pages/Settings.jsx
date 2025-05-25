import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button, Form, Row, Col, Alert, Card } from "react-bootstrap";
import axios from "axios";

const Settings = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Sidebar nav items
  const personalTabs = [
    { key: "profile", label: "Profile", icon: "fa-user" },
    { key: "password", label: "Password", icon: "fa-lock" },
    { key: "data", label: "Data", icon: "fa-shield-alt", disabled: true },
  ];
  const companyTabs = [
    { key: "details", label: "Details", icon: "fa-building", disabled: true },
    { key: "team", label: "Team members", icon: "fa-users", disabled: true },
    {
      key: "format",
      label: "Format settings",
      icon: "fa-clock",
      disabled: true,
    },
    { key: "jobs", label: "Job boards", icon: "fa-briefcase", disabled: true },
    {
      key: "messages",
      label: "Automated messages",
      icon: "fa-comment-dots",
      disabled: true,
    },
  ];

  const handleTabSelect = (k) => {
    setActiveTab(k);
    setSuccess("");
    setError("");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match.");
      setLoading(false);
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/auth/change-password",
        {
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Password changed successfully.");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid py-5 min-vh-100"
      style={{ background: "#f8f9fa" }}
    >
      <div className="row justify-content-center">
        <div className="col-12 col-md-3 mb-4">
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="fw-bold mb-3">Account Settings</h5>
              <div className="mb-4">
                <div className="text-uppercase text-secondary small mb-2">
                  Personal
                </div>
                <ul className="nav flex-column gap-1">
                  {personalTabs.map((tab) => (
                    <li key={tab.key} className="nav-item">
                      <button
                        className={`nav-link d-flex align-items-center gap-2 px-2 py-2 rounded ${
                          activeTab === tab.key
                            ? "active bg-primary text-white"
                            : "text-dark"
                        }`}
                        style={{
                          border: 0,
                          background: "none",
                          width: "100%",
                          fontWeight: 500,
                          cursor: tab.disabled ? "not-allowed" : "pointer",
                          opacity: tab.disabled ? 0.5 : 1,
                        }}
                        onClick={() =>
                          !tab.disabled && handleTabSelect(tab.key)
                        }
                        disabled={tab.disabled}
                      >
                        <i className={`fa ${tab.icon} me-2`}></i>
                        {tab.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="text-uppercase text-secondary small mb-2">
                  Company
                </div>
                <ul className="nav flex-column gap-1">
                  {companyTabs.map((tab) => (
                    <li key={tab.key} className="nav-item">
                      <button
                        className={`nav-link d-flex align-items-center gap-2 px-2 py-2 rounded ${
                          activeTab === tab.key
                            ? "active bg-primary text-white"
                            : "text-dark"
                        }`}
                        style={{
                          border: 0,
                          background: "none",
                          width: "100%",
                          fontWeight: 500,
                          cursor: tab.disabled ? "not-allowed" : "pointer",
                          opacity: tab.disabled ? 0.5 : 1,
                        }}
                        onClick={() =>
                          !tab.disabled && handleTabSelect(tab.key)
                        }
                        disabled={tab.disabled}
                      >
                        <i className={`fa ${tab.icon} me-2`}></i>
                        {tab.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className="col-12 col-md-7">
          <Card className="shadow-sm border-0">
            <Card.Body>
              {activeTab === "profile" && (
                <>
                  <h4 className="mb-4 fw-bold">Profile Details</h4>
                  <Row className="mb-3">
                    <Col sm={4} className="fw-semibold text-secondary">
                      Name:
                    </Col>
                    <Col sm={8}>{user?.name}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={4} className="fw-semibold text-secondary">
                      Email:
                    </Col>
                    <Col sm={8}>{user?.email}</Col>
                  </Row>
                  <Row className="mb-3">
                    <Col sm={4} className="fw-semibold text-secondary">
                      Role:
                    </Col>
                    <Col sm={8}>{user?.role}</Col>
                  </Row>
                </>
              )}
              {activeTab === "password" && (
                <>
                  <h4 className="mb-4 fw-bold">Change Password</h4>
                  {success && <Alert variant="success">{success}</Alert>}
                  {error && <Alert variant="danger">{error}</Alert>}
                  <Form onSubmit={handlePasswordChange} autoComplete="off">
                    <Form.Group className="mb-3" controlId="currentPassword">
                      <Form.Label>Current Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="currentPassword"
                        value={form.currentPassword}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="newPassword">
                      <Form.Label>New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="newPassword"
                        value={form.newPassword}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="confirmPassword">
                      <Form.Label>Confirm New Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                    <Button
                      variant="primary"
                      type="submit"
                      className="w-100 fw-semibold"
                      disabled={loading}
                    >
                      {loading ? "Changing..." : "Change Password"}
                    </Button>
                  </Form>
                </>
              )}
              {/* Placeholder for other tabs */}
              {activeTab !== "profile" && activeTab !== "password" && (
                <div className="text-center text-secondary py-5">
                  <i className="fa fa-lock fa-2x mb-3"></i>
                  <div className="fw-semibold">
                    This section is coming soon.
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
