const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const admin = require("firebase-admin");
const serviceAccount = require("./utils/service-account");
const RequestRide = require("./models/requestRide");
const errorHandling = require("./middleware/errorHandling");
const deliveryRoutes = require("./routes/deliveryRoutes");
const chatRoutes = require("./routes/chatRoutes");
const http = require("http");
const socketIO = require("socket.io");
const server = http.createServer(app);
const io = socketIO(server);

app.use(morgan("dev"));
app.use(bodyParser.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Origin",
      "x-access-token",
      "X-Requested-With",
      "Accept",
      "Access-Control-Allow-Headers",
      "Access-Control-Request-Headers",
      "Access-Control-Allow-Origin",
      "Access-Control-Allow-Methods",
      "Access-Control-Allow-Credentials",
    ],
  })
);
app.use(bodyParser.urlencoded({ extended: true }));

connectDB();
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://glopilot.firebaseio.com",
  });
}
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/", require("./routes/user"));
app.use("/vehicle", require("./routes/owner"));

connectDB();
app.get("/", (req, res) => {
  res.send("Hello World");
});
app.use("/", require("./routes/user"));

io.on("connection", (socket) => {
  socket.on("ride request", async (args) => {
    try {
      const rr = new RequestRide({
        userId: args.userId,
        vehicleId: args.vehicleId,
        requestType: args.requestType,
        status: args.status,
        pickupLocation: { type: "Point", coordinates: args.pickupLocation },
        dropoffLocation: { type: "Point", coordinates: args.dropoffLocation },
        paymentMethod: args.paymentMethod,
        totalCost: args.totalCost,
        additionalFees: args.additionalFees,
      });
      await rr.save();
      socket.emit("ride request success", { success: true });
    } catch (error) {
      socket.emit("ride request failed", { error: error.message });
    }
  });
  socket.on("get ride requests", async (args) => {
    try {
      const nearbyRequests = await RequestRide.find({
        pickupLocation: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [args.longitude, args.latitude],
            },
            $maxDistance: args.maxDistance,
          },
        },
      });
      socket.emit("nearbyRideRequests", { requests: nearbyRequests });
    } catch (error) {
      socket.emit("nearbyRideRequestsError", { error: error.message });
    }
  });
  socket.on("rejectRideRequest", async (data) => {
    try {
      // Find the ride request by ID and update its status to "rejected"
      const rejectedRequest = await RideRequest.findById(data.requestId);
      rejectedRequest.rejectedBy = [
        ...rejectedRequest.rejectedBy,
        data.driverId,
      ];
      await rejectedRequest.save();

      if (!rejectedRequest) {
        // Notify the driver if the request ID was not found
        socket.emit("rejectRideRequestError", {
          error: "Ride request not found.",
        });
        return;
      }

      // Fetch nearby requests after rejecting to refresh the driver's list
      const nearbyRequests = await fetchNearbyRequests(
        data.latitude,
        data.longitude
      );
      socket.emit("nearbyRideRequests", { requests: nearbyRequests });
    } catch (err) {
      // Notify the driver about any errors
      socket.emit("rejectRideRequestError", {
        error: "Error rejecting the ride request.",
      });
    }
  });
  socket.on("acceptRideRequest", async (data) => {
    try {
      // Find the ride request by ID and update its status to "accepted"
      const acceptedRequest = await RideRequest.findByIdAndUpdate(
        data.requestId,
        { status: "accepted", driverId: data.driverId },
        { new: true }
      );

      if (!acceptedRequest) {
        // Notify the driver if the request ID was not found
        socket.emit("acceptRideRequestError", {
          error: "Ride request not found.",
        });
        return;
      }

      // Notify the passenger that the request was accepted
      const passengerSocketId = await findPassengerSocketId(
        acceptedRequest.userId
      );
      if (passengerSocketId) {
        io.to(passengerSocketId).emit("rideRequestAccepted", {
          message: "Ride request accepted!",
        });
      }

      // Fetch nearby requests after accepting to refresh the driver's list
      const nearbyRequests = await fetchNearbyRequests(
        data.latitude,
        data.longitude
      );
      socket.emit("nearbyRideRequests", { requests: nearbyRequests });
    } catch (err) {
      // Notify the driver about any errors
      socket.emit("acceptRideRequestError", {
        error: "Error accepting the ride request.",
      });
    }
  });
});
async function findPassengerSocketId(passengerId) {
  const passengers = await io.allSockets();
  for (const socketId of passengers) {
    const socket = io.sockets.sockets.get(socketId);
    if (socket && socket.request.session.userId === passengerId) {
      return socketId;
    }
  }
  return null;
}

app.use("/delivery", deliveryRoutes);
app.use("/chat", chatRoutes);
app.use(errorHandling);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
