const http = require("http");
const express = require("express");
const app = express();
const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server);

const Passenger = require("../models/passenger");
const Driver = require("../models/driver");

exports.sendMessage = async (req, res) => {
  // Socket.io event handling for real-time updates and chat
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle driver location updates
    socket.on("updateLocation", async (data) => {
      const { driverId, location } = data;

      try {
        // Update the driver's location in the database
        await Driver.findByIdAndUpdate(driverId, { location });
        // Broadcast the updated location to all connected clients (passengers)
        socket.broadcast.emit("driverLocationUpdate", { driverId, location });
      } catch (err) {
        console.error(err);
      }
    });

    // Handle passenger connection
    socket.on("passengerConnect", async (data) => {
      const { passengerId } = data;

      try {
        // Update the passenger's socketId in the database
        await Passenger.findByIdAndUpdate(passengerId, { socketId: socket.id });
      } catch (err) {
        console.error(err);
      }
    });

    // Handle driver connection
    socket.on("driverConnect", async (data) => {
      const { driverId } = data;

      try {
        // Update the driver's socketId in the database
        await Driver.findByIdAndUpdate(driverId, { socketId: socket.id });
      } catch (err) {
        console.error(err);
      }
    });

    // Handle chat messages between drivers and passengers
    socket.on("sendMessage", async (data) => {
      const { senderId, receiverId, message } = data;

      try {
        // Find the sender and receiver in the database
        const senderType = senderId.startsWith("D") ? Driver : Passenger;
        const receiverType = receiverId.startsWith("D") ? Driver : Passenger;
        const sender = await senderType.findById(senderId);
        const receiver = await receiverType.findById(receiverId);

        if (!sender || !receiver) {
          return;
        }

        // Emit the chat message to the sender and receiver
        io.to(sender.socketId).emit("chatMessage", {
          senderId,
          receiverId,
          message,
        });
        io.to(receiver.socketId).emit("chatMessage", {
          senderId,
          receiverId,
          message,
        });
      } catch (err) {
        console.error(err);
      }
    });

    // Handle user disconnection
    socket.on("disconnect", async () => {
      console.log("A user disconnected:", socket.id);

      try {
        // Find and update the user (driver or passenger) by socketId
        const driver = await Driver.findOneAndUpdate(
          { socketId: socket.id },
          { socketId: null }
        );
        const passenger = await Passenger.findOneAndUpdate(
          { socketId: socket.id },
          { socketId: null }
        );

        // Make the driver available again
        if (driver) {
          driver.isAvailable = true;
          await driver.save();
        }
      } catch (err) {
        console.error(err);
      }
    });
  });
};
