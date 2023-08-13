// routes/deliveryRoutes.js
const express = require("express");
const router = express.Router();
const deliveryController = require("../controllers/deliveryController");

// Create a new delivery request
router.post(
  "/create-delivery-request",
  deliveryController.createDeliveryRequest
);

// Get all delivery requests
router.get("/all-delivery-requests", deliveryController.getAllDeliveryRequests);

module.exports = router;
