const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rentalSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  vehicle: {
    type: Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  rentalType: {
    type: String,
    enum: ["car", "scooter"],
    required: true,
  },
  rentalStartDate: {
    type: Date,
    required: true,
  },
  rentalEndDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "active", "completed", "cancelled"],
    default: "pending",
  },
  pickupLocation: {
    type: [Number], // [longitude, latitude]
    required: true,
  },
  dropoffLocation: {
    type: [Number], // [longitude, latitude]
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  additionalFees: Number,
  isRoundTrip: {
    type: Boolean,
    default: false,
  },
  socketId: String,
});

const Rental = mongoose.model("Rental", rentalSchema);

module.exports = Rental;
