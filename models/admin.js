// models/admin.js
const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: String,
  // ... Other fields
});

module.exports = mongoose.model("Admin", adminSchema);
