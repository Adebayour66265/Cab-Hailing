const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
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
io.on("connection", (socket) => {
  console.log("a user connected");
});
app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
