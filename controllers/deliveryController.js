const DeliveryRequest = require("../models/deliveryRequest");
const Driver = require("../models/driver");

// Function to find the nearest available driver for a delivery request
async function findNearestAvailableDriver(deliveryRequest) {
  const nearestDriver = await Driver.findOne({
    isAvailable: true,
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: deliveryRequest.pickupLocation,
        },
      },
    },
  });

  return nearestDriver;
}

// Function to handle delivery request matching and assignment
async function handleDeliveryRequestMatching(deliveryRequestId) {
  try {
    const deliveryRequest = await DeliveryRequest.findById(deliveryRequestId);

    if (!deliveryRequest || deliveryRequest.status !== "pending") {
      throw new Error("Invalid or already processed delivery request.");
    }

    const nearestDriver = await findNearestAvailableDriver(deliveryRequest);

    if (!nearestDriver) {
      throw new Error("No available drivers found.");
    }

    // Assign the nearest driver to the delivery request
    deliveryRequest.driver = nearestDriver._id;
    deliveryRequest.status = "assigned";
    await deliveryRequest.save();

    // Update the driver's availability status
    nearestDriver.isAvailable = false;
    await nearestDriver.save();

    return deliveryRequest;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

// API endpoint to create a new delivery request

exports.createDeliveryRequest = async (req, res) => {
  const { pickupLocation, deliveryLocation } = req.body;

  try {
    // Create the delivery request
    const deliveryRequest = await DeliveryRequest.create({
      pickupLocation,
      deliveryLocation,
    });

    // Match and assign the delivery request to a driver
    const matchedDeliveryRequest = await handleDeliveryRequestMatching(
      deliveryRequest._id
    );

    res.status(200).json({
      message: "Delivery request created and assigned.",
      deliveryRequest: matchedDeliveryRequest,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

// API endpoint to complete a delivery request
exports.completeDelivery = async (req, res) => {
  const { deliveryRequestId } = req.body;

  try {
    const deliveryRequest = await DeliveryRequest.findById(
      deliveryRequestId
    ).populate("driver");

    if (!deliveryRequest) {
      return res.status(404).json({ message: "Delivery request not found." });
    }

    // Mark the delivery request as completed
    deliveryRequest.status = "completed";
    await deliveryRequest.save();

    // Make the driver available again
    if (deliveryRequest.driver) {
      deliveryRequest.driver.isAvailable = true;
      await deliveryRequest.driver.save();
    }

    res
      .status(200)
      .json({ message: "Delivery request completed successfully." });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "An error occurred. Please try again later." });
  }
};

module.exports = { findNearestAvailableDriver, handleDeliveryRequestMatching };
