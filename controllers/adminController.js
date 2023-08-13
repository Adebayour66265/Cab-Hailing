// controllers/adminController.js
const Driver = require("../models/driver");

exports.banDriver = (req, res) => {
  const { driverId } = req.params;

  Driver.findByIdAndUpdate(driverId, { banned: true })
    .then(() => res.send("Driver banned"))
    .catch((err) => res.status(500).send(err.message));
};
