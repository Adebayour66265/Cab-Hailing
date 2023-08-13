// controllers/rideRequestController.js
const RideRequest = require("../models/rideRequest");

exports.requestRide = (req, res) => {
  const { passengerId /* other request details */ } = req.body;

  const newRideRequest = new RideRequest({ passengerId /* other fields */ });
  newRideRequest
    .save()
    .then(() => res.send("Ride requested"))
    .catch((err) => res.status(500).send(err.message));
};
