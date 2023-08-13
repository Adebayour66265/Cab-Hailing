// models/chat.js
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  senderId: mongoose.Schema.Types.ObjectId,
  receiverId: mongoose.Schema.Types.ObjectId,
  message: String,
  // ... Other fields
});

module.exports = mongoose.model("Chat", chatSchema);
