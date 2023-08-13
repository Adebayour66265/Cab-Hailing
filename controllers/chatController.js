// controllers/chatController.js
const Chat = require("../models/chat");

exports.sendMessage = (req, res) => {
  const { senderId, receiverId, message } = req.body;

  const newMessage = new Chat({ senderId, receiverId, message });
  newMessage
    .save()
    .then(() => res.send("Message sent"))
    .catch((err) => res.status(500).send(err.message));
};
