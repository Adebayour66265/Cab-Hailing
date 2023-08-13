// routes/rideRequests.js
const express = require("express");
const router = express.Router();
const rideRequestController = require("../controllers/rideRequestController");

router.post("/request-ride", rideRequestController.requestRide);

module.exports = router;
