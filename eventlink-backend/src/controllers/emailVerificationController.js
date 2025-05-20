const User = require("../models/User");

// Verify email
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    console.log("Received token for verification:", token);
    const user = await User.findOne({ where: { verification_token: token } });

    if (!user) {
      const alreadyVerifiedUser = await User.findOne({
        where: { is_verified: true, verification_token: null },
      });
      if (alreadyVerifiedUser) {
        return res.status(200).json({ message: "Email verified successfully" });
      }
      console.log("No user found with the provided token.");
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.is_verified = true;
    user.verification_token = null;
    await user.save();

    console.log("User verified successfully:", user);
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    res
      .status(500)
      .json({ message: "Error verifying email", error: error.message });
  }
};
