// routes/admin.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.post("/ban-driver/:driverId", adminController.banDriver);

module.exports = router;
