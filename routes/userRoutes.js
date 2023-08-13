// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Register a new user (customer or driver)
router.post("/register", userController.registerUser);

// Get nearby available drivers
router.get("/nearby-drivers", userController.getNearbyDrivers);

module.exports = router;
