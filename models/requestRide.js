const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const requestRide = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  vehicleId: {
    type: Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  driverId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  requestType: {
    type: String,
    enum: ["car", "tricycle"],
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "active", "completed", "cancelled"],
    default: "pending",
  },
  pickupLocation: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      index: "2dsphere",
    },
  },
  dropoffLocation: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      index: "2dsphere",
    },
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  totalCost: {
    type: Number,
    required: true,
  },
  additionalFees: {
    type: Number,
    required: true,
  },
  location: {
    type: {
      type: String,
      ref: "Driver",
      required: true,
    },

    coordinates: {
      type: [Number],
      required: true,
    },
  },
  socketId: String,
});

const RequestRide = mongoose.model("RequestRide", requestRide);

module.exports = RequestRide;
