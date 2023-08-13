// controllers/driverController.js
const Driver = require("../models/driver");

exports.updateLocation = (req, res) => {
  const { driverId } = req.params;
  const { longitude, latitude } = req.body;

  Driver.findByIdAndUpdate(driverId, { location: [longitude, latitude] })
    .then(() => res.send("Location updated"))
    .catch((err) => res.status(500).send(err.message));
};
