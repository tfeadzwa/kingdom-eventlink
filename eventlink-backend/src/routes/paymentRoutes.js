const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { authenticate } = require("../middleware/authMiddleware");

// Initiate Ecocash Express Checkout
router.post(
  "/initiate",
  authenticate,
  paymentController.initiateEcocashPayment
);

// Paynow status update webhook
router.post("/status-update", paymentController.statusUpdate);

// Poll payment status (optional)
router.get("/:reference/status", authenticate, paymentController.pollStatus);

module.exports = router;
