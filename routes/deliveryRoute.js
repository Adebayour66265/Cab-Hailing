const express = require("express");
const router = express.Router();
const deliveryController = require("../controllers/deliveryController");

router.post("/delivery_request", deliveryController.createDeliveryRequest);
router.post("/complete_delivery", deliveryController.completeDelivery);

module.exports = router;
