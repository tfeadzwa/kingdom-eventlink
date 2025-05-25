import React from "react";

const PaymentCancel = () => (
  <div className="container py-5 text-center">
    <h2 className="text-danger mb-3">Payment Cancelled</h2>
    <p>Your payment was cancelled or not completed. You can try again.</p>
    <a href="/dashboard" className="btn btn-secondary mt-3">
      Go to Dashboard
    </a>
  </div>
);

export default PaymentCancel;
