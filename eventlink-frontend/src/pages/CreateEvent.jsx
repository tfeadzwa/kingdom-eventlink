import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Register.css";
import { Toaster } from "react-hot-toast";
import notify from "../components/Notify.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const initialState = {
  title: "",
  category: "",
  description: "",
  attendance_reason: "",
  start_date: "",
  end_date: "",
  start_time: "",
  end_time: "",
  address: "",
  country: "",
  state: "",
  city: "",
  location: "",
  type: "online",
  capacity: "",
  visibility: true,
  image: null,
};

const defaultTicket = { type: "General", price: "", quantity: "" };

const CreateEvent = () => {
  const [formData, setFormData] = useState(initialState);
  const [tickets, setTickets] = useState([{ ...defaultTicket }]);
  const [message, setMessage] = useState("");
  const [createdEventId, setCreatedEventId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [completedSteps, setCompletedSteps] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  useEffect(() => {
    axios.get("http://localhost:5000/api/auth/categories").then((res) => {
      setCategories(res.data.categories || []);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleTicketChange = (idx, e) => {
    const { name, value } = e.target;
    setTickets((prev) =>
      prev.map((t, i) => (i === idx ? { ...t, [name]: value } : t))
    );
  };

  const addTicket = () => setTickets([...tickets, { ...defaultTicket }]);
  const removeTicket = (idx) => setTickets(tickets.filter((_, i) => i !== idx));

  const validateStep = (stepToValidate) => {
    const errors = {};
    if (stepToValidate === 1) {
      if (!formData.title.trim()) errors.title = "Title is required.";
      if (!formData.category) errors.category = "Category is required.";
      if (!formData.description.trim())
        errors.description = "Description is required.";
      if (
        formData.capacity === undefined ||
        formData.capacity === null ||
        formData.capacity === "" ||
        isNaN(Number(formData.capacity)) ||
        Number(formData.capacity) < 1
      ) {
        errors.capacity = "Capacity is required and must be at least 1.";
      }
    }
    if (stepToValidate === 2) {
      if (!formData.start_date) errors.start_date = "Start date is required.";
      if (!formData.end_date) errors.end_date = "End date is required.";
      if (!formData.start_time) errors.start_time = "Start time is required.";
      if (!formData.end_time) errors.end_time = "End time is required.";
    }
    if (stepToValidate === 3) {
      if (!formData.address.trim()) errors.address = "Address is required.";
      if (!formData.country.trim()) errors.country = "Country is required.";
      if (!formData.state.trim()) errors.state = "State is required.";
      if (!formData.city.trim()) errors.city = "City is required.";
      if (!formData.location.trim()) errors.location = "Location is required.";
    }
    if (stepToValidate === 4) {
      if (!tickets.length)
        errors.tickets = "At least one ticket type is required.";
      tickets.forEach((t, idx) => {
        if (!t.type.trim())
          errors[`ticket_type_${idx}`] = "Ticket type is required.";
        if (t.price === "" || isNaN(Number(t.price)) || Number(t.price) < 0)
          errors[`ticket_price_${idx}`] = "Valid price required.";
        if (
          t.quantity === "" ||
          isNaN(Number(t.quantity)) ||
          Number(t.quantity) < 1
        )
          errors[`ticket_quantity_${idx}`] = "Quantity must be at least 1.";
      });
    }
    return errors;
  };

  const handleNext = (currentStep) => {
    const errors = validateStep(currentStep);
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0) {
      setCompletedSteps((prev) => ({ ...prev, [currentStep]: true }));
      setStep(currentStep + 1);
    }
  };

  const handlePrev = (currentStep) => {
    setStep(currentStep - 1);
  };

  const canAccessStep = (targetStep) => {
    if (targetStep === 1) return true;
    for (let i = 1; i < targetStep; i++) {
      if (!completedSteps[i]) return false;
    }
    return true;
  };

  const getStepIcon = (stepNum) => {
    if (completedSteps[stepNum]) {
      return (
        <span className="text-success ms-2">
          <FontAwesomeIcon icon="check-circle" />
        </span>
      );
    } else {
      return (
        <span className="text-danger ms-2">
          <FontAwesomeIcon icon="exclamation-circle" />
        </span>
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const errors = validateStep(5);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setLoading(false);
      return;
    }
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        data.append(key, value);
      }
    });
    data.append("tickets", JSON.stringify(tickets));
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/events",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage(response.data.message || "Event created successfully.");
      setCreatedEventId(response.data.event?.id);
      notify.success(response.data.message || "Event created successfully.");
      setCompletedSteps({ 1: true, 2: true, 3: true, 4: true, 5: true });
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Failed to create event. Please try again."
      );
      notify.error(
        error.response?.data?.message ||
          "Failed to create event. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container bg-light min-vh-100 d-flex align-items-center justify-content-center py-5">
      <Toaster position="top-center" reverseOrder={false} />
      <div
        className="register-card border p-4 rounded-4 bg-white w-100"
        style={{ maxWidth: "70dvw" }}
      >
        <div className="mb-4 text-center">
          <span className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-2">
            <FontAwesomeIcon
              icon="calendar-plus"
              size="2x"
              className="text-primary"
            />
          </span>
          <h2
            className="register-title fw-bold text-primary mb-1"
            style={{ fontSize: "2rem" }}
          >
            Create a New Event
          </h2>
          <p className="text-secondary mb-0" style={{ fontSize: "1.1rem" }}>
            Fill in the details below to launch your event on EventLink.
          </p>
        </div>
        <ul className="nav nav-pills mb-4 justify-content-center">
          {["Details", "Timings", "Location", "Tickets", "Media & Publish"].map(
            (label, idx) => {
              const navStep = idx + 1;
              return (
                <li className="nav-item" key={label}>
                  <button
                    className={`nav-link${step === navStep ? " active" : ""}`}
                    type="button"
                    onClick={() => canAccessStep(navStep) && setStep(navStep)}
                    disabled={!canAccessStep(navStep)}
                    style={{
                      cursor: canAccessStep(navStep)
                        ? "pointer"
                        : "not-allowed",
                    }}
                  >
                    {label} {getStepIcon(navStep)}
                  </button>
                </li>
              );
            }
          )}
        </ul>
        <form
          onSubmit={handleSubmit}
          className="register-form row g-3"
          encType="multipart/form-data"
        >
          {/* Step 1: Details */}
          {step === 1 && (
            <div className="col-12">
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body p-4">
                  <h4 className="fw-bold text-primary mb-3 border-bottom pb-2 text-start">
                    Event Details
                  </h4>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label
                        htmlFor="title"
                        className="form-label fw-semibold text-start w-100"
                      >
                        Event Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control rounded-3 shadow-sm${
                          fieldErrors.title ? " is-invalid" : ""
                        }`}
                        id="title"
                        name="title"
                        placeholder="Enter event title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                      {fieldErrors.title && (
                        <div className="invalid-feedback d-block text-start">
                          {fieldErrors.title}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="category"
                        className="form-label fw-semibold text-start w-100"
                      >
                        Category <span className="text-danger">*</span>
                      </label>
                      <select
                        className={`form-select rounded-3 shadow-sm${
                          fieldErrors.category ? " is-invalid" : ""
                        }`}
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option
                            key={cat.id || cat._id || cat}
                            value={cat.name || cat}
                          >
                            {cat.name || cat}
                          </option>
                        ))}
                      </select>
                      {fieldErrors.category && (
                        <div className="invalid-feedback d-block text-start">
                          {fieldErrors.category}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="capacity"
                        className="form-label fw-semibold text-start w-100"
                      >
                        Capacity <span className="text-danger">*</span>
                      </label>
                      <input
                        type="number"
                        className={`form-control rounded-3 shadow-sm${
                          fieldErrors.capacity ? " is-invalid" : ""
                        }`}
                        id="capacity"
                        name="capacity"
                        placeholder="Total number of seats/attendees"
                        value={formData.capacity}
                        onChange={handleChange}
                        min="1"
                        required
                      />
                      {fieldErrors.capacity && (
                        <div className="invalid-feedback d-block text-start">
                          {fieldErrors.capacity}
                        </div>
                      )}
                    </div>
                    <div className="col-12">
                      <label
                        htmlFor="description"
                        className="form-label fw-semibold text-start w-100"
                      >
                        Description <span className="text-danger">*</span>
                      </label>
                      <textarea
                        className={`form-control rounded-3 shadow-sm${
                          fieldErrors.description ? " is-invalid" : ""
                        }`}
                        id="description"
                        name="description"
                        placeholder="Describe your event"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        required
                      />
                      {fieldErrors.description && (
                        <div className="invalid-feedback d-block text-start">
                          {fieldErrors.description}
                        </div>
                      )}
                    </div>
                    <div className="col-12">
                      <label
                        htmlFor="attendance_reason"
                        className="form-label fw-semibold text-start w-100"
                      >
                        Why should people attend?{" "}
                        <span className="text-secondary">(Optional)</span>
                      </label>
                      <textarea
                        className="form-control rounded-3 shadow-sm"
                        id="attendance_reason"
                        name="attendance_reason"
                        placeholder="Share what makes this event special"
                        rows={2}
                        value={formData.attendance_reason}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-white border-0 d-flex justify-content-end">
                  <button
                    type="button"
                    className="btn btn-primary btn-lg fw-bold px-4"
                    onClick={() => handleNext(1)}
                  >
                    Next: Timings
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Step 2: Timings */}
          {step === 2 && (
            <div className="col-12">
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body p-4">
                  <h4 className="fw-bold text-primary mb-3 border-bottom pb-2 text-start">
                    Event Timings
                  </h4>
                  <div className="row g-4 align-items-end">
                    <div className="col-md-6 col-lg-6">
                      <label
                        htmlFor="start_date"
                        className="form-label fw-semibold text-start w-100"
                      >
                        Start Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className={`form-control rounded-3 shadow-sm${
                          fieldErrors.start_date ? " is-invalid" : ""
                        }`}
                        id="start_date"
                        name="start_date"
                        value={formData.start_date}
                        onChange={handleChange}
                        required
                      />
                      {fieldErrors.start_date && (
                        <div className="invalid-feedback d-block text-start">
                          {fieldErrors.start_date}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 col-lg-6">
                      <label
                        htmlFor="end_date"
                        className="form-label fw-semibold text-start w-100"
                      >
                        End Date <span className="text-danger">*</span>
                      </label>
                      <input
                        type="date"
                        className={`form-control rounded-3 shadow-sm${
                          fieldErrors.end_date ? " is-invalid" : ""
                        }`}
                        id="end_date"
                        name="end_date"
                        value={formData.end_date}
                        onChange={handleChange}
                        required
                      />
                      {fieldErrors.end_date && (
                        <div className="invalid-feedback d-block text-start">
                          {fieldErrors.end_date}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row g-4 align-items-end mt-1">
                    <div className="col-md-6 col-lg-6">
                      <label
                        htmlFor="start_time"
                        className="form-label fw-semibold text-start w-100"
                      >
                        Start Time <span className="text-danger">*</span>
                      </label>
                      <input
                        type="time"
                        className={`form-control rounded-3 shadow-sm${
                          fieldErrors.start_time ? " is-invalid" : ""
                        }`}
                        id="start_time"
                        name="start_time"
                        value={formData.start_time}
                        onChange={handleChange}
                        required
                      />
                      {fieldErrors.start_time && (
                        <div className="invalid-feedback d-block text-start">
                          {fieldErrors.start_time}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 col-lg-6">
                      <label
                        htmlFor="end_time"
                        className="form-label fw-semibold text-start w-100"
                      >
                        End Time <span className="text-danger">*</span>
                      </label>
                      <input
                        type="time"
                        className={`form-control rounded-3 shadow-sm${
                          fieldErrors.end_time ? " is-invalid" : ""
                        }`}
                        id="end_time"
                        name="end_time"
                        value={formData.end_time}
                        onChange={handleChange}
                        required
                      />
                      {fieldErrors.end_time && (
                        <div className="invalid-feedback d-block text-start">
                          {fieldErrors.end_time}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-white border-0 d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-secondary btn-lg fw-bold px-4"
                    onClick={() => handlePrev(2)}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-lg fw-bold px-4"
                    onClick={() => handleNext(2)}
                  >
                    Next: Location
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Step 3: Location */}
          {step === 3 && (
            <div className="col-12">
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body p-4">
                  <h4 className="fw-bold text-primary mb-3 border-bottom pb-2 text-start">
                    Event Location
                  </h4>
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label
                        htmlFor="country"
                        className="form-label fw-semibold text-start w-100"
                      >
                        Country <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control rounded-3 shadow-sm${
                          fieldErrors.country ? " is-invalid" : ""
                        }`}
                        id="country"
                        name="country"
                        placeholder="Country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                      />
                      {fieldErrors.country && (
                        <div className="invalid-feedback d-block text-start">
                          {fieldErrors.country}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="state"
                        className="form-label fw-semibold text-start w-100"
                      >
                        State <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control rounded-3 shadow-sm${
                          fieldErrors.state ? " is-invalid" : ""
                        }`}
                        id="state"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                      {fieldErrors.state && (
                        <div className="invalid-feedback d-block text-start">
                          {fieldErrors.state}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row g-4 mt-1">
                    <div className="col-md-6">
                      <label
                        htmlFor="city"
                        className="form-label fw-semibold text-start w-100"
                      >
                        City <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control rounded-3 shadow-sm${
                          fieldErrors.city ? " is-invalid" : ""
                        }`}
                        id="city"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />
                      {fieldErrors.city && (
                        <div className="invalid-feedback d-block text-start">
                          {fieldErrors.city}
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="location"
                        className="form-label fw-semibold text-start w-100"
                      >
                        Location <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control rounded-3 shadow-sm${
                          fieldErrors.location ? " is-invalid" : ""
                        }`}
                        id="location"
                        name="location"
                        placeholder="Venue, Hall, Online, etc."
                        value={formData.location}
                        onChange={handleChange}
                        required
                      />
                      {fieldErrors.location && (
                        <div className="invalid-feedback d-block text-start">
                          {fieldErrors.location}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row g-4 mt-1">
                    <div className="col-12">
                      <label
                        htmlFor="address"
                        className="form-label fw-semibold text-start w-100"
                      >
                        Address <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className={`form-control rounded-3 shadow-sm${
                          fieldErrors.address ? " is-invalid" : ""
                        }`}
                        id="address"
                        name="address"
                        placeholder="Enter address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                      {fieldErrors.address && (
                        <div className="invalid-feedback d-block text-start">
                          {fieldErrors.address}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-white border-0 d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-secondary btn-lg fw-bold px-4"
                    onClick={() => handlePrev(3)}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-lg fw-bold px-4"
                    onClick={() => handleNext(3)}
                  >
                    Next: Tickets
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Step 4: Tickets */}
          {step === 4 && (
            <>
              <div className="col-12 mb-2">
                <h4 className="fw-bold text-primary mb-3 border-bottom pb-2 text-start">
                  Ticket Types
                </h4>
              </div>
              <div className="table-responsive mb-3">
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Type</th>
                      <th>Price</th>
                      <th>Qty</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket, idx) => (
                      <tr key={idx}>
                        <td>
                          <input
                            type="text"
                            name="type"
                            className={`form-control${
                              fieldErrors[`ticket_type_${idx}`]
                                ? " is-invalid"
                                : ""
                            }`}
                            placeholder="Type (e.g. General, VIP)"
                            value={ticket.type}
                            onChange={(e) => handleTicketChange(idx, e)}
                            required
                          />
                          {fieldErrors[`ticket_type_${idx}`] && (
                            <div className="invalid-feedback d-block">
                              {fieldErrors[`ticket_type_${idx}`]}
                            </div>
                          )}
                        </td>
                        <td>
                          <input
                            type="number"
                            name="price"
                            className={`form-control${
                              fieldErrors[`ticket_price_${idx}`]
                                ? " is-invalid"
                                : ""
                            }`}
                            placeholder="Price"
                            value={ticket.price}
                            onChange={(e) => handleTicketChange(idx, e)}
                            min="0"
                            required
                          />
                          {fieldErrors[`ticket_price_${idx}`] && (
                            <div className="invalid-feedback d-block">
                              {fieldErrors[`ticket_price_${idx}`]}
                            </div>
                          )}
                        </td>
                        <td>
                          <input
                            type="number"
                            name="quantity"
                            className={`form-control${
                              fieldErrors[`ticket_quantity_${idx}`]
                                ? " is-invalid"
                                : ""
                            }`}
                            placeholder="Quantity"
                            value={ticket.quantity}
                            onChange={(e) => handleTicketChange(idx, e)}
                            min="1"
                            required
                          />
                          {fieldErrors[`ticket_quantity_${idx}`] && (
                            <div className="invalid-feedback d-block">
                              {fieldErrors[`ticket_quantity_${idx}`]}
                            </div>
                          )}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => removeTicket(idx)}
                            title="Delete Ticket"
                            disabled={tickets.length === 1}
                          >
                            <FontAwesomeIcon icon="trash" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex gap-2 mb-3">
                <button
                  type="button"
                  className="btn btn-outline-primary flex-grow-1"
                  onClick={addTicket}
                >
                  <FontAwesomeIcon icon="plus" /> Add Ticket Type
                </button>
                <button
                  type="button"
                  className="btn btn-secondary flex-grow-1"
                  onClick={() => handlePrev(4)}
                >
                  Back
                </button>
              </div>
              <div className="col-12 mt-3 d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-primary btn-lg fw-bold"
                  onClick={() => handleNext(4)}
                >
                  Next: Media & Publish
                </button>
              </div>
            </>
          )}
          {/* Step 5: Media & Publish */}
          {step === 5 && (
            <div className="col-12">
              <div className="card shadow-sm border-0 mb-4">
                <div className="card-body p-4">
                  <h4 className="fw-bold text-primary mb-3 border-bottom pb-2 text-start">
                    Media & Publish
                  </h4>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label
                        htmlFor="image"
                        className="form-label fw-semibold text-start w-100"
                      >
                        Event Image <span className="text-danger">*</span>
                      </label>
                      <input
                        type="file"
                        className={`form-control${
                          fieldErrors.image ? " is-invalid" : ""
                        }`}
                        id="image"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        required
                      />
                      {fieldErrors.image && (
                        <div className="invalid-feedback d-block">
                          {fieldErrors.image}
                        </div>
                      )}
                      {formData.image && typeof formData.image === "object" && (
                        <div className="mt-2">
                          <img
                            src={URL.createObjectURL(formData.image)}
                            alt="Preview"
                            className="img-thumbnail"
                            style={{ maxHeight: 120 }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="col-md-6 d-flex align-items-center">
                      <div className="form-check form-switch ms-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="visibility"
                          name="visibility"
                          checked={formData.visibility}
                          onChange={handleChange}
                        />
                        <label
                          className="form-check-label fw-semibold"
                          htmlFor="visibility"
                        >
                          Publicly Visible
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer bg-white border-0 d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-secondary btn-lg fw-bold me-2"
                    onClick={() => handlePrev(5)}
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="register-button btn btn-primary btn-lg fw-bold shadow-sm"
                    disabled={loading}
                  >
                    {loading ? "Publishing..." : "Publish Event"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
        {message && (
          <p className="register-footer mt-3 mb-0 text-secondary">{message}</p>
        )}
      </div>
    </div>
  );
};

export default CreateEvent;
