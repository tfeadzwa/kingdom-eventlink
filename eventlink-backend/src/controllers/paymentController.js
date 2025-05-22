const { Paynow } = require("paynow");
const Payment = require("../models/Payment");
const { v4: uuidv4 } = require("uuid");

// Set your Paynow integration keys here or use environment variables
const PAYNOW_INTEGRATION_ID = process.env.PAYNOW_INTEGRATION_ID;
const PAYNOW_INTEGRATION_KEY = process.env.PAYNOW_INTEGRATION_KEY;
const paynow = new Paynow(PAYNOW_INTEGRATION_ID, PAYNOW_INTEGRATION_KEY);

paynow.resultUrl =
  process.env.PAYNOW_RESULT_URL ||
  "https://yourdomain.com/api/payments/status-update";
paynow.returnUrl =
  process.env.PAYNOW_RETURN_URL || "https://yourdomain.com/payment/return";

// Initiate Ecocash Express Checkout
exports.initiateEcocashPayment = async (req, res) => {
  try {
    const { registration_id, amount, phone, email, tickets } = req.body;
    const user_id = req.user.id; // assuming auth middleware sets req.user
    const reference = uuidv4();

    // Create payment record (status: Created)
    const payment = await Payment.create({
      user_id,
      registration_id,
      reference,
      amount,
      phone,
      status: "Created",
    });

    // Create a new payment for Paynow and add ticket items
    let paynowPayment = paynow.createPayment(reference, email || undefined);
    if (Array.isArray(tickets)) {
      tickets.forEach((ticket) => {
        paynowPayment.add(
          ticket.type,
          Number(ticket.price) * Number(ticket.quantity)
        );
      });
    } else {
      paynowPayment.add("Event Registration", amount);
    }

    // Initiate mobile based transaction (Ecocash)
    const response = await paynow.sendMobile(paynowPayment, phone, "ecocash");

    if (response.success) {
      payment.poll_url = response.pollUrl;
      payment.status = "Sent";
      await payment.save();
      return res.json({
        success: true,
        reference,
        instructions: response.instructions,
        pollUrl: response.pollUrl,
      });
    } else {
      payment.status = "Error";
      await payment.save();
      return res.status(400).json({ success: false, error: response.error });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};

// Paynow status update webhook
exports.statusUpdate = async (req, res) => {
  try {
    const { reference, status, pollurl, paynowreference, paymentchannel } =
      req.body;
    const payment = await Payment.findOne({ where: { reference } });
    if (!payment) return res.status(404).end();
    payment.status = status;
    payment.poll_url = pollurl;
    payment.paynow_reference = paynowreference;
    payment.payment_channel = paymentchannel;
    await payment.save();
    res.status(200).end();
  } catch (err) {
    res.status(500).end();
  }
};

// Poll payment status (optional)
exports.pollStatus = async (req, res) => {
  try {
    const { reference } = req.params;
    const payment = await Payment.findOne({ where: { reference } });
    if (!payment || !payment.poll_url)
      return res.status(404).json({ error: "Not found" });
    const status = await paynow.pollTransaction(payment.poll_url);
    return res.json({ status: status.status(), paid: status.paid() });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
