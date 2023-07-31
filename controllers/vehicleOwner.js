const Vehicle = require('../models/vehicle')

const createVehicle = async (req, res) => {
    try {
        const { type, model, seats, picture, pickUpLocation} = req.body
        const vehicle = new Vehicle({
            owner: req.user._id,
            type: type,
            model: model,
            seats: seats,
            picture: picture,
            pickUpLocation: pickUpLocation
        })
        await vehicle.save()
        res.status(201).json({ message: "Vehicle created successfully", vehicle: vehicle })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

module.exports = {createVehicle}