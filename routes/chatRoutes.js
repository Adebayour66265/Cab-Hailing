const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.post("/send_message", chatController.sendMessage);

module.exports = router;
