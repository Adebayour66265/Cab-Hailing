// app.js
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");
const bodyParser = require("body-parser");
// const i18nMiddleware = require("./middleware/i18n");
const connectDB = require("./config/db");
const driverRoutes = require("./routes/drivers");
const rideRequestRoutes = require("./routes/rideRequests");
const chatRoutes = require("./routes/chat");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/userRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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
// ... Set up other middleware

// Routes

// app.use(i18nMiddleware);
app.use("/drivers", driverRoutes);
app.use("/ride-requests", rideRequestRoutes);
app.use("/chat", chatRoutes);
app.use("/admin", adminRoutes);
app.use("/users", userRoutes);
app.use("/deliveries", deliveryRoutes);
// ... Set up other configurations
connectDB();

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
