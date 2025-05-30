const User = require("../models/User");

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users." });
  }
};

// Create a user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, is_verified } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required." });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already in use." });
    }
    const user = await User.create({
      name,
      email,
      password,
      role: role || "user",
      is_verified: !!is_verified,
    });
    res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to create user." });
  }
};

// Update a user (add is_verified and password support)
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, is_verified, password } = req.body;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found." });
    user.name = name;
    user.email = email;
    user.role = role;
    if (typeof is_verified !== "undefined") user.is_verified = !!is_verified;
    if (password) user.password = password;
    await user.save();
    res.status(200).json({ message: "User updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user." });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found." });
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user." });
  }
};
