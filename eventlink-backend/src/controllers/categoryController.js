const Category = require("../models/Category");

// Create a new category (Admin Only)
exports.createCategory = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") {
      console.log("Access Denied:");
      return res.status(403).json({
        message: "Access denied. Admins only.",
        user: req.user ? { id: req.user.id, role: req.user.role } : null,
        timestamp: new Date().toISOString(),
      });
    }

    const { name, description } = req.body;
    console.log(name, description);
    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }
    const category = await Category.create({ name, description });
    res
      .status(201)
      .json({ message: "Category created successfully", category });
  } catch (error) {
    console.error("Error creating category:", error.message);
    res.status(500).json({ message: "Failed to create category" });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ order: [["name", "ASC"]] });
    console.log(categories);
    res.status(200).json({ categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};
