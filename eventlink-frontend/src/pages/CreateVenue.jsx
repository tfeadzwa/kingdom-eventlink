import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const stepperGroups = [
  {
    title: "Venue Overview",
    icon: ["fas", "building"],
    fields: [
      "name",
      "slug",
      "description",
      "venue_type",
      "guest_capacity",
      "image_url",
    ],
  },
  {
    title: "Location & Contact",
    icon: ["fas", "map-marker-alt"],
    fields: [
      "address",
      "city",
      "state",
      "country",
      "postal_code",
      "latitude",
      "longitude",
      "contact_email",
      "contact_phone",
    ],
  },
  {
    title: "Amenities",
    icon: ["fas", "concierge-bell"],
    fields: ["amenities"],
  },
  {
    title: "Pricing & Status",
    icon: ["fas", "money-bill-wave"],
    fields: [
      "price_per_hour",
      "price_per_day",
      "price_currency",
      "availability",
      "status",
    ],
  },
];

const fieldLabels = {
  name: "Venue Name",
  slug: "Slug (optional)",
  description: "Description",
  venue_type: "Venue Type",
  guest_capacity: "Guest Capacity",
  image_url: "Image URL",
  address: "Address",
  city: "City",
  state: "State",
  country: "Country",
  postal_code: "Postal Code",
  latitude: "Latitude",
  longitude: "Longitude",
  contact_email: "Contact Email",
  contact_phone: "Contact Phone",
  amenities: "Amenities (comma separated)",
  price_per_hour: "Price Per Hour",
  price_per_day: "Price Per Day",
  price_currency: "Currency",
  availability: "Available for Booking",
  status: "Status",
};

const initialState = {
  name: "",
  slug: "",
  description: "",
  venue_type: "",
  amenities: "",
  guest_capacity: "",
  address: "",
  city: "",
  state: "",
  country: "",
  postal_code: "",
  latitude: "",
  longitude: "",
  availability: true,
  status: "active",
  price_per_hour: "",
  price_per_day: "",
  price_currency: "USD",
  contact_phone: "",
  contact_email: "",
  image_url: "",
};

const CreateVenue = () => {
  const [formData, setFormData] = useState(initialState);
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [fieldErrors, setFieldErrors] = useState({});
  const [venueList, setVenueList] = useState([]);
  const [selectedVenueId, setSelectedVenueId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch venue list for dropdown
    axios.get("http://localhost:5000/api/venues/venue-list").then((res) => {
      setVenueList(res.data.venues || []);
    });
  }, []);

  const handleVenueSelect = (e) => {
    const venueId = e.target.value;
    setSelectedVenueId(venueId);
    if (!venueId) return;
    const venue = venueList.find((v) => String(v.id) === String(venueId));
    if (venue) {
      setFormData((prev) => ({
        ...prev,
        name: venue.venue_name || "",
        slug: venue.slug || "",
        description: venue.description || "",
        venue_type: venue.venue_type || "",
        address: venue.venue_address || "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
        latitude: venue.latitude || "",
        longitude: venue.longitude || "",
        // leave other fields as is
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setImageFile(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      let imageFilename = formData.image_url;
      if (imageFile) {
        const imgForm = new FormData();
        imgForm.append("image", imageFile);
        const imgRes = await axios.post(
          "http://localhost:5000/api/venues/upload-image",
          imgForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        imageFilename = imgRes.data.filename;
      }
      const venueData = { ...formData, image_url: imageFilename };
      const res = await axios.post(
        "http://localhost:5000/api/venues/venues",
        venueData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Venue created successfully!");
      setTimeout(() => navigate("/browse-venues"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create venue.");
    } finally {
      setLoading(false);
    }
  };

  const validateStep = (stepIdx) => {
    const errors = {};
    if (stepIdx === 0) {
      if (!formData.name.trim()) errors.name = "Venue name is required.";
      if (!formData.description.trim())
        errors.description = "Description is required.";
      if (!formData.venue_type.trim())
        errors.venue_type = "Venue type is required.";
      if (
        !formData.guest_capacity ||
        isNaN(Number(formData.guest_capacity)) ||
        Number(formData.guest_capacity) < 1
      )
        errors.guest_capacity = "Guest capacity must be at least 1.";
    }
    if (stepIdx === 1) {
      if (!formData.address.trim()) errors.address = "Address is required.";
      if (!formData.city.trim()) errors.city = "City is required.";
      if (!formData.state.trim()) errors.state = "State is required.";
      if (!formData.country.trim()) errors.country = "Country is required.";
      if (!formData.contact_email.trim())
        errors.contact_email = "Contact email is required.";
      if (!formData.contact_phone.trim())
        errors.contact_phone = "Contact phone is required.";
    }
    if (stepIdx === 2) {
      if (!formData.amenities.trim())
        errors.amenities = "Please list at least one amenity.";
    }
    if (stepIdx === 3) {
      if (!formData.price_per_hour && !formData.price_per_day)
        errors.price_per_hour = "At least one price is required.";
      if (!formData.price_currency.trim())
        errors.price_currency = "Currency is required.";
    }
    return errors;
  };

  const handleNextStep = () => {
    const errors = validateStep(step);
    setFieldErrors(errors);
    if (Object.keys(errors).length === 0 && step < stepperGroups.length - 1) {
      setStep((s) => s + 1);
    }
  };

  const stepIcons = [
    ["fas", "building"],
    ["fas", "map-marker-alt"],
    ["fas", "concierge-bell"],
    ["fas", "money-bill-wave"],
  ];
  const stepLabels = [
    "Venue Overview",
    "Location & Contact",
    "Amenities",
    "Pricing & Status",
  ];

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10">
          <div className="card shadow-lg p-4 border-0 rounded-4">
            <div className="text-center mb-2">
              <h2 className="fw-bold mb-2 text-primary flex-column d-flex align-items-center gap-2">
                <FontAwesomeIcon icon={["fas", "plus"]} className="me-2" />
                Create a New Venue
              </h2>
              <p className="text-secondary mb-4" style={{ fontSize: "1.1rem" }}>
                Add a new venue to your event platform. Fill in the details
                below to make your venue discoverable and bookable for event
                organizers and attendees.
              </p>
            </div>
            {/* Stepper */}
            <div className="d-flex align-items-center justify-content-center mb-4 gap-3 flex-wrap">
              {stepLabels.map((label, idx) => (
                <div
                  key={label}
                  className="d-flex flex-column align-items-center"
                  style={{ minWidth: 120 }}
                >
                  <div
                    className={`rounded-circle d-flex align-items-center justify-content-center mb-2 ${
                      step === idx
                        ? "bg-primary text-white shadow"
                        : completedStep(idx)
                        ? "bg-success text-white"
                        : "bg-light text-secondary border"
                    }`}
                    style={{ width: 44, height: 44, fontSize: 22 }}
                  >
                    <FontAwesomeIcon icon={stepIcons[idx]} />
                  </div>
                  <span
                    className={`small fw-semibold ${
                      step === idx ? "text-primary" : "text-secondary"
                    }`}
                    style={{ textAlign: "center", minHeight: 32 }}
                  >
                    {label}
                  </span>
                  {idx < stepLabels.length - 1 && (
                    <div
                      style={{
                        width: 32,
                        height: 2,
                        background: step > idx ? "#0d6efd" : "#dee2e6",
                        margin: "0 0 0 44px",
                      }}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            {/* Stepper Form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              autoComplete="off"
              onKeyDown={(e) => {
                if (e.key === "Enter" && step < stepperGroups.length - 1) {
                  console.log("Prevented Enter submit on step", step);
                  e.preventDefault();
                }
              }}
            >
              <div className="row g-3">
                {stepperGroups[step].fields.map((field) => (
                  <div
                    className={field === "description" ? "col-12" : "col-md-6"}
                    key={field}
                  >
                    <label className="form-label fw-semibold">
                      {fieldLabels[field]}
                    </label>
                    {field === "name" ? (
                      <select
                        className="form-select"
                        name="name"
                        value={formData.name}
                        onChange={(e) => {
                          handleChange(e);
                          const venue = venueList.find(
                            (v) => v.venue_name === e.target.value
                          );
                          if (venue) {
                            setFormData((prev) => ({
                              ...prev,
                              name: venue.venue_name || "",
                              slug: venue.slug || "",
                              description: venue.description || "",
                              venue_type: venue.venue_type || "",
                              address: venue.venue_address || "",
                              city: "",
                              state: "",
                              country: "",
                              postal_code: "",
                              latitude: venue.latitude || "",
                              longitude: venue.longitude || "",
                              // leave other fields as is
                            }));
                          }
                        }}
                      >
                        <option value="">-- Select from venue list --</option>
                        {venueList.map((venue) => (
                          <option key={venue.id} value={venue.venue_name}>
                            {venue.venue_name} ({venue.venue_type})
                          </option>
                        ))}
                      </select>
                    ) : field === "description" ? (
                      <textarea
                        className="form-control"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                      ></textarea>
                    ) : field === "availability" ? (
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          name="availability"
                          checked={formData.availability}
                          onChange={handleChange}
                          id="venue-availability"
                        />
                        <label
                          className="form-check-label ms-2"
                          htmlFor="venue-availability"
                        >
                          {formData.availability ? "Available" : "Unavailable"}
                        </label>
                      </div>
                    ) : field === "status" ? (
                      <select
                        className="form-select"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="under_maintenance">
                          Under Maintenance
                        </option>
                        <option value="archived">Archived</option>
                      </select>
                    ) : field === "price_currency" ? (
                      <select
                        className="form-select"
                        name="price_currency"
                        value={formData.price_currency}
                        onChange={handleChange}
                      >
                        <option value="USD">USD</option>
                        <option value="ZWL">ZWL</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    ) : field === "image_url" ? (
                      <input
                        type="file"
                        className="form-control"
                        name="image_url"
                        accept="image/*"
                        onChange={handleChange}
                      />
                    ) : (
                      <input
                        type={
                          field.includes("price") ||
                          field === "guest_capacity" ||
                          field === "latitude" ||
                          field === "longitude"
                            ? "number"
                            : "text"
                        }
                        step={
                          field === "latitude" || field === "longitude"
                            ? "0.0000001"
                            : undefined
                        }
                        className="form-control"
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        required={field === "name"}
                      />
                    )}
                    {fieldErrors[field] && (
                      <div className="text-danger small mt-1">
                        {fieldErrors[field]}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-between mt-4">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-4"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                >
                  <FontAwesomeIcon
                    icon={["fas", "arrow-left"]}
                    className="me-2"
                  />{" "}
                  Previous
                </button>
                {step < stepperGroups.length - 1 ? (
                  <button
                    type="button"
                    className="btn btn-primary px-4"
                    onClick={handleNextStep}
                  >
                    Next{" "}
                    <FontAwesomeIcon
                      icon={["fas", "arrow-right"]}
                      className="ms-2"
                    />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-success px-4 fw-bold"
                    disabled={loading}
                  >
                    {loading ? "Creating..." : "Create Venue"}
                  </button>
                )}
              </div>
              {message && (
                <div className="alert alert-info mt-3 text-center">
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  // Helper for completed step style
  function completedStep(idx) {
    return idx < step;
  }
};

export default CreateVenue;
