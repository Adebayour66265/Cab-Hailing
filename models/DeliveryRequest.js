// models/DeliveryRequest.js
const mongoose = require("mongoose");

const deliveryRequestSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  location: {
    type: [Number], // [longitude, latitude]
    index: "2d", // create geospatial index
  },
  isFulfilled: Boolean,
  driver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  // Other delivery request-related fields
});

module.exports = mongoose.model("DeliveryRequest", deliveryRequestSchema);
