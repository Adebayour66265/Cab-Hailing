const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const deliveryRequestSchema = new Schema({
  pickupLocation: {
    type: [Number], // [latitude, longitude]
    required: true,
  },
  deliveryLocation: {
    type: [Number], // [latitude, longitude]
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "assigned", "completed"],
    default: "pending",
  },
  driver: {
    type: Schema.Types.ObjectId,
    ref: "Driver",
  },
});
const DeliveryRequest = mongoose.model(
  "DeliveryRequest",
  deliveryRequestSchema
);
module.exports = DeliveryRequest;
