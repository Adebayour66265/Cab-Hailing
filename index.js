const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const RequestRide = require("./models/requestRide");
const connectDB = require("./config/db");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

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
});

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
