import React from "react";
import { toast } from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NotifySuccess = ({ message }) => (
  <div
    className="d-flex align-items-center bg-white shadow rounded-3 px-4 py-3 border border-success border-2 animate__animated animate__fadeInDown"
    style={{ minWidth: 320, color: "#198754", fontWeight: 500 }}
  >
    <FontAwesomeIcon
      icon={["fas", "circle-check"]}
      className="me-3 text-success fs-4"
    />
    <span>{message}</span>
  </div>
);
const NotifyError = ({ message }) => (
  <div
    className="d-flex align-items-center bg-white shadow rounded-3 px-4 py-3 border border-danger border-2 animate__animated animate__fadeInDown"
    style={{ minWidth: 320, color: "#dc3545", fontWeight: 500 }}
  >
    <FontAwesomeIcon
      icon={["fas", "circle-xmark"]}
      className="me-3 text-danger fs-4"
    />
    <span>{message}</span>
  </div>
);
const NotifyInfo = ({ message }) => (
  <div
    className="d-flex align-items-center bg-white shadow rounded-3 px-4 py-3 border border-primary border-2 animate__animated animate__fadeInDown"
    style={{ minWidth: 320, color: "#0d6efd", fontWeight: 500 }}
  >
    <FontAwesomeIcon
      icon={["fas", "circle-info"]}
      className="me-3 text-primary fs-4"
    />
    <span>{message}</span>
  </div>
);

const notify = {
  success: (message) => toast.custom(<NotifySuccess message={message} />),
  error: (message) => toast.custom(<NotifyError message={message} />),
  info: (message) => toast.custom(<NotifyInfo message={message} />),
};

export default notify;
