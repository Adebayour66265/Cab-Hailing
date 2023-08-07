const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  name: String,
  location: {
    type: [Number], // [latitude, longitude]
    index: "2d", // Enable geospatial indexing for location field
  },
  isAvailable: Boolean,
  socketId: String,
});

const Driver = mongoose.model("Driver", driverSchema);

module.exports = Driver;
