// routes/drivers.js
const express = require("express");
const router = express.Router();
const driverController = require("../controllers/driverController");

router.post("/update-location/:driverId", driverController.updateLocation);

module.exports = router;
