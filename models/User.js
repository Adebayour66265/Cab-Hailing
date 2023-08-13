const mongoose = require("mongoose");

// Data models
const userSchema = new mongoose.Schema({
  name: String,
  location: {
    type: [Number], // [longitude, latitude]
    index: "2d", // create geospatial index
  },
  isDriver: Boolean,
  // Other user-related fields
});

const User = mongoose.model("User", userSchema);
module.exports = User;
