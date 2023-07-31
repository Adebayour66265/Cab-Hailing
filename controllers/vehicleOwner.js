const Vehicle = require('../models/vehicle')

const addCar = async (req, res) => {
    try {
        const { model, seats, picture, pickUpLocation, dropOffLocation } = req.body
        const vehicle = new Vehicle({
            owner: req.user._id,
            type: "car",
            model: model,
            seats: seats,
            picture: picture,
            pickUpLocation: pickUpLocation,
            dropOffLocation
        })
        await vehicle.save()
        res.status(201).json({ message: "Vehicle created successfully", vehicle: vehicle })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const addScooter = async (req, res) => {
    try {
        const { model, picture, pickUpLocation, dropOffLocation } = req.body
        const vehicle = new Vehicle({ model, picture, pickUpLocation, dropOffLocation, type: "scooter" })
        await vehicle.save()
        res.status(201).json({ message: "Vehicle created successfully", vehicle: vehicle })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const editVehicle = async (req, res) => {
    try{
        const vehicle = await Vehicle.findById(req.params.id)
        if(!vehicle) return res.status(404).json({message: "Vehicle not found"})
        if(vehicle.owner.toString() !== req.user._id.toString()) return res.status(403).json({message: "Unauthorized"})
        const { model, seats, picture, pickUpLocation, dropOffLocation } = req.body
        vehicle.model = model
        vehicle.seats = seats
        vehicle.picture = picture
        vehicle.pickUpLocation = pickUpLocation
        vehicle.dropOffLocation = dropOffLocation
        await vehicle.save()
        res.status(200).json({message: 'success', vehicle})
    } catch (error){
        console.log(error)
        res.status(500).json({message: error.message})
    }
}

const deleteVehicle = async (req, res) => {
    try{
        const vehicle = await Vehicle.findById(req.params.id)
        if(!vehicle) return res.status(404).json({message: "Vehicle not found"})
        if(vehicle.owner.toString() !== req.user._id.toString()) return res.status(403).json({message: "Unauthorized"})
        await vehicle.remove()
        res.status(200).json({message: 'success'})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
}

const getVehicles = async (req, res) => {
    try{
        const vehicles = await Vehicle.find({owner: req.user._id})
        if(!vehicles) return res.status(404).json({message: "No vehicles found"})
        res.status(200).json({message: 'success', vehicles})
    } catch (error){
        console.log(error)
        res.status(500).json({message: error.message})
    }
}

const getVehicle = async (req, res) => {
    try{
        const vehicle = await Vehicle.findById(req.params.id)
        if(!vehicle) return res.status(404).json({message: "Vehicle not found"})
        res.status(200).json({message: 'success', vehicle})
    } catch (error){
        console.log(error)
        res.status(500).json({message: error.message})
    }
}

module.exports = { addCar, addScooter, editVehicle, deleteVehicle, getVehicles, getVehicle }