const mongoose = require("mongoose");

const passengerSchema = new mongoose.Schema({
  name: String,
  socketId: String,
});

const Passenger = mongoose.model("Passenger", passengerSchema);

module.exports = Passenger;
