// middleware/socketAuth.js
module.exports = (socket, next) => {
  // Socket.IO
  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinDriverRoom", (userId) => {
      socket.join(userId);
    });

    socket.on("acceptDeliveryRequest", async (driverId, requestId) => {
      const request = await DeliveryRequest.findByIdAndUpdate(requestId, {
        driver: driverId,
        isFulfilled: true,
      });

      io.to(request.customer.toString()).emit("requestAccepted", request);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });

  next();
};
