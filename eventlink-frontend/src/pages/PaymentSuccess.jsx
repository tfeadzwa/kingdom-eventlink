import React from "react";

const PaymentSuccess = () => (
  <div className="container py-5 text-center">
    <h2 className="text-success mb-3">Payment Successful!</h2>
    <p>Your payment was received. Thank you for your booking.</p>
    <a href="/dashboard" className="btn btn-primary mt-3">
      Go to Dashboard
    </a>
  </div>
);

export default PaymentSuccess;
