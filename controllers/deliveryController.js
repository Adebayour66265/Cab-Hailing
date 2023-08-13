// controllers/deliveryController.js
const DeliveryRequest = require("../models/DeliveryRequest");
const User = require("../models/User");

// new delivery request
exports.createDeliveryRequest = async (req, res) => {
  try {
    const { customerId, location } = req.body;

    const newRequest = await DeliveryRequest.create({
      customer: customerId,
      location: location,
      isFulfilled: false,
    });

    const nearestDriver = await findNearestDriver(location);
    if (nearestDriver) {
      newRequest.driver = nearestDriver._id;
      newRequest.isFulfilled = true;
      await newRequest.save();

      io.to(nearestDriver._id.toString()).emit(
        "newDeliveryRequest",
        newRequest
      );
    }

    res.status(201).json(newRequest);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

// Get all delivery requests
exports.getAllDeliveryRequests = async (req, res) => {
  try {
    const deliveryRequests = await DeliveryRequest.find().populate(
      "customer driver"
    );
    res.status(200).json(deliveryRequests);
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};

// Function to find the nearest available driver
async function findNearestDriver(requestLocation) {
  const nearestDriver = await User.findOne({
    isDriver: true,
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: requestLocation,
        },
      },
    },
  });

  return nearestDriver;
}
