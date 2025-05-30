const express = require("express");
const {
  authenticate,
  authorizeAdmin,
} = require("../middleware/authMiddleware");
const {
  getAllUsers,
  updateUser,
  deleteUser,
  createUser,
} = require("../controllers/adminController");

const router = express.Router();

// Admin: Get all users
router.get("/users", authenticate, authorizeAdmin, getAllUsers);
// Admin: Update user
router.put("/users/:id", authenticate, authorizeAdmin, updateUser);
// Admin: Delete user
router.delete("/users/:id", authenticate, authorizeAdmin, deleteUser);
// Admin: Create user
router.post("/users", authenticate, authorizeAdmin, createUser);

module.exports = router;
