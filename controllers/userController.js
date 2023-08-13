// controllers/userController.js
const User = require("../models/User");

// Register a new user (customer or driver)
exports.registerUser = async (req, res) => {
  try {
    const { name, location, isDriver } = req.body;

    const newUser = await User.create({
      name: name,
      location: location,
      isDriver: isDriver,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

// Get nearby available drivers
exports.getNearbyDrivers = async (req, res) => {
  try {
    const { location } = req.query;

    const nearbyDrivers = await User.find({
      isDriver: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: JSON.parse(location),
          },
          $maxDistance: config.maxDriverDistance,
        },
      },
    });

    res.status(200).json(nearbyDrivers);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};
