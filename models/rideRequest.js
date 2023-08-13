// models/rideRequest.js
const mongoose = require("mongoose");

const rideRequestSchema = new mongoose.Schema({
  passengerId: mongoose.Schema.Types.ObjectId,
  // ... Other fields
});

module.exports = mongoose.model("RideRequest", rideRequestSchema);
