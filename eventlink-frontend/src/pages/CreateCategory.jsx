import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Register.css";

const CreateCategory = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/auth/categories",
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.message || "Category created successfully.");
      // setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      setMessage(
        err.response?.data?.message || "Failed to create category. Try again."
      );
    }
  };

  return (
    <div className="register-container bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div
        className="register-card shadow-lg border border-2 border-primary-subtle p-4 rounded-4 bg-white w-100"
        style={{ maxWidth: 500 }}
      >
        <div className="mb-4 text-center">
          <span className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-2">
            <svg
              width="32"
              height="32"
              fill="currentColor"
              className="text-primary"
            >
              <use href="#layer-group" />
            </svg>
          </span>
          <h2
            className="register-title fw-bold text-primary mb-1"
            style={{ fontSize: "2rem" }}
          >
            Create a New Category
          </h2>
          <p className="text-secondary mb-0" style={{ fontSize: "1.1rem" }}>
            Organize your events by adding a new category.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group mb-3">
            <label htmlFor="cat-name" className="fw-semibold mb-1">
              Category Name
            </label>
            <input
              type="text"
              id="cat-name"
              className="form-control form-control-lg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-4">
            <label htmlFor="cat-desc" className="fw-semibold mb-1">
              Description
            </label>
            <textarea
              id="cat-desc"
              className="form-control form-control-lg"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-lg w-100 fw-bold shadow-sm"
          >
            Add Category
          </button>
        </form>
        {message && (
          <p className="register-footer mt-3 mb-0 text-secondary">{message}</p>
        )}
      </div>
    </div>
  );
};

export default CreateCategory;
