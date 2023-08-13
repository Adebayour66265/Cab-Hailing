const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const authorizeUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(403).json({ message: "Token is required" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.email)
      return res.status(403).json({ message: "Invalid Token" });
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "rider") req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
const authorizeOwner = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(403).json({ message: "Token is required" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.email)
      return res.status(403).json({ message: "Invalid Token" });
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ message: "User not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
const authorizeCarOwner = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(403).json({ message: "Token is required" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.email)
      return res.status(403).json({ message: "Invalid Token" });
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role !== "carOwner")
      return res.status(403).json({ message: "Unauthorized" });
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const authorizeDriver = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token is required" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.email)
      return res.status(401).json({ message: "Invalid Token" });
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const authorizeScooterOwner = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token is required" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.email)
      return res.status(401).json({ message: "Invalid Token" });
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== "scooterOwner")
      return res.status(403).json({ message: "Unauthorized" });
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const authorizeHotelOwner = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token is required" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.email)
      return res.status(401).json({ message: "Invalid Token" });
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== "hotelOwner")
      return res.status(403).json({ message: "Unauthorized" });
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const authorizeShortletOwner = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token is required" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.email)
      return res.status(401).json({ message: "Invalid Token" });
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== "shortletOwner")
      return res.status(403).json({ message: "Unauthorized" });
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

const authorizeFoodVendor = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token is required" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.email)
      return res.status(401).json({ message: "Invalid Token" });
    const user = await User.findOne({ email: decoded.email });
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== "foodVendor")
      return res.status(403).json({ message: "Unauthorized" });
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  authorizeUser,
  authorizeOwner,
  verifyUser,
  authorizeCarOwner,
  authorizeDriver,
  authorizeScooterOwner,
  authorizeFoodVendor,
  authorizeHotelOwner,
  authorizeShortletOwner,
};
