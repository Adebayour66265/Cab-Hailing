# Hailing-Backend

```
Database of the project
```

```
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", true);
const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((_) => console.log("MongoDB Connected"));
};

module.exports = connectDB;

```

```
add user Routes to the project
```

```

// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Register a new user (customer or driver)
router.post("/register", userController.registerUser);

// Get nearby available drivers
router.get("/nearby-drivers", userController.getNearbyDrivers);

module.exports = router;
```

```
Add All this to the Index.js root of the project
```

```
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
origin: "\*",
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
```

```
Add user Controller of the project this one is just a dummy user
```

```
// controllers/userController.js
const User = require("../models/User");
// Register a new user (customer or driver)
exports.registerUser = async (req, res) => {
  try {
    const { name, location, isDriver } = req.body;

    const newUser = await User.create({
      name: name,
      location: location,
      isDriver: isDriver,
    });

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

// Get nearby available drivers
exports.getNearbyDrivers = async (req, res) => {
  try {
    const { location } = req.query;

    const nearbyDrivers = await User.find({
      isDriver: true,
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: JSON.parse(location),
          },
          $maxDistance: config.maxDriverDistance,
        },
      },
    });

    res.status(200).json(nearbyDrivers);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

```

```
Example of user models
```

```
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

```
