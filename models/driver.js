// models/driver.js
const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  name: String,
  location: { type: [Number], index: "2d" },
  // ... Other fields
});

module.exports = mongoose.model("Driver", driverSchema);
