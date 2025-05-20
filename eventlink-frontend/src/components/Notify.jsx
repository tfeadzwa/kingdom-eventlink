import React from "react";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const baseStyle = {
  minWidth: 340,
  maxWidth: 420,
  fontWeight: 500,
  boxShadow: "0 6px 32px 0 rgba(0,0,0,0.10), 0 1.5px 6px 0 rgba(0,0,0,0.08)",
  borderRadius: 18,
  borderWidth: 2,
  padding: 0,
  background: "linear-gradient(90deg, #f8fafc 0%, #f1f3f9 100%)",
};

const iconCircle = (color) => ({
  background: color,
  borderRadius: "50%",
  width: 44,
  height: 44,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: 18,
  boxShadow: "0 2px 8px 0 rgba(0,0,0,0.07)",
});

const NotifySuccess = ({ message }) => (
  <div
    className="d-flex align-items-center justify-content-center w-100"
    style={{ zIndex: 9999 }}
  >
    <div
      className="d-flex align-items-center border border-success animate__animated animate__fadeInDown mx-auto"
      style={{ ...baseStyle, borderColor: "#198754", margin: "0 auto" }}
    >
      <span style={iconCircle("#d1f7e7")}>
        {" "}
        {/* Soft green bg */}
        <FontAwesomeIcon
          icon={["fas", "circle-check"]}
          className="text-success fs-3"
        />
      </span>
      <div className="flex-grow-1">
        <div
          className="fw-bold text-success mb-1"
          style={{ fontSize: "1.08rem" }}
        >
          Success
        </div>
        <div className="text-secondary" style={{ fontSize: "1.01rem" }}>
          {message}
        </div>
      </div>
    </div>
  </div>
);
const NotifyError = ({ message }) => (
  <div
    className="d-flex align-items-center justify-content-center w-100"
    style={{ zIndex: 9999 }}
  >
    <div
      className="d-flex align-items-center border border-danger animate__animated animate__fadeInDown mx-auto"
      style={{ ...baseStyle, borderColor: "#dc3545", margin: "0 auto" }}
    >
      <span style={iconCircle("#ffe0e6")}>
        {" "}
        {/* Soft red bg */}
        <FontAwesomeIcon
          icon={["fas", "circle-xmark"]}
          className="text-danger fs-3"
        />
      </span>
      <div className="flex-grow-1">
        <div
          className="fw-bold text-danger mb-1"
          style={{ fontSize: "1.08rem" }}
        >
          Error
        </div>
        <div className="text-secondary" style={{ fontSize: "1.01rem" }}>
          {message}
        </div>
      </div>
    </div>
  </div>
);
const NotifyInfo = ({ message }) => (
  <div
    className="d-flex align-items-center justify-content-center w-100"
    style={{ zIndex: 9999 }}
  >
    <div
      className="d-flex align-items-center border border-primary animate__animated animate__fadeInDown mx-auto"
      style={{ ...baseStyle, borderColor: "#0d6efd", margin: "0 auto" }}
    >
      <span style={iconCircle("#e3eaff")}>
        {" "}
        {/* Soft blue bg */}
        <FontAwesomeIcon
          icon={["fas", "circle-info"]}
          className="text-primary fs-3"
        />
      </span>
      <div className="flex-grow-1">
        <div
          className="fw-bold text-primary mb-1"
          style={{ fontSize: "1.08rem" }}
        >
          Info
        </div>
        <div className="text-secondary" style={{ fontSize: "1.01rem" }}>
          {message}
        </div>
      </div>
    </div>
  </div>
);

const notify = {
  success: (message) => toast.custom(<NotifySuccess message={message} />),
  error: (message) => toast.custom(<NotifyError message={message} />),
  info: (message) => toast.custom(<NotifyInfo message={message} />),
};

export default notify;
