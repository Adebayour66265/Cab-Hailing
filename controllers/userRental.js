const Rental = require('../models/rental')
const Vehicle = require('../models/vehicle')
const admin = require('firebase-admin')

const getCars = async (req, res) => {
    try {
        const cars = await Vehicle.find({ type: 'car' })
        if (cars.length == 0) return res.status(404).json({ message: 'No cars found' })
        res.status(200).json({ cars })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const getCar = async (req, res) => {
    try {
        const car = await Vehicle.findById(req.params.id)
        if (!car) return res.status(404).json({ message: 'Car not found' })
        res.status(200).json({ car })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const getScooters = async (req, res) => {
    try {
        const scooters = await Vehicle.find({ type: 'scooter' })
        if (scooters.length == 0) return res.status(404).json({ message: 'No scooters found' })
        res.status(200).json({ scooters })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const getScooter = async (req, res) => {
    try {
        const scooter = await Vehicle.findById(req.params.id)
        if (!scooter) return res.status(404).json({ message: 'Scooter not found' })
        res.status(200).json({ scooter })
    } catch (error) {
        console.log(error)
        res.status(404).json({ message: error.message })
    }
}


const rentCar = async (req, res) => {
    try {
        const { pickUpDate, dropOffDate } = req.body
        const vehicle = await Vehicle.findById(req.params.id)
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' })
        if (vehicle.type !== 'car') return res.status(404).json({ message: 'Vehicle not found' })
        const rental = new Rental({
            renter: req.user._id,
            vehicle: vehicle._id,
            pickUpDate: pickUpDate,
            dropOffDate: dropOffDate
        })
        await rental.save()
        const message = {
            notification: {
                title: 'New Rental Request',
                body: `${req.user.name} has requested to rent your vehicle`
            },
            token: vehicle.owner.fcmToken
        }
        admin.messaging().send(message).then((response) => {
            console.log("Notification sent successfully", response)
            res.status(201).json({ message: 'success', rental })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const rentScooter = async (req, res) => {
    try {
        const { pickUpDate, dropOffDate } = req.body
        const vehicle = await Vehicle.findById(req.params.id)
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' })
        if (vehicle.type !== 'scooter') return res.status(404).json({ message: 'Vehicle not found' })
        const rental = new Rental({
            renter: req.user._id,
            vehicle: vehicle._id,
            pickUpDate: pickUpDate,
            dropOffDate: dropOffDate
        })
        await rental.save()
        const message = {
            notification: {
                title: 'New Rental Request',
                body: `${req.user.name} has requested to rent your vehicle`
            },
            token: vehicle.owner.fcmToken
        }
        admin.messaging().send(message).then((response) => {
            console.log("Notification sent successfully", response)
            res.status(201).json({ message: 'success', rental })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const getRentals = async (req, res) => {
    try {
        const rentals = await Rental.find({ renter: req.user._id })
        if (rentals.length == 0) return res.status(404).json({ message: 'No rentals found' })
        res.status(200).json({ rentals })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const getRental = async (req, res) => {
    try {
        const rental = await Rental.findById(req.params.id)
        if (!rental) return res.status(404).json({ message: 'Rental not found' })
        res.status(200).json({ rental })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const axios = require('axios');

const lockVehicle = async (req, res) => {
    const vehicleId = req.params.id;

    try {
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' })
        await axios.post(`https://iotdeviceapi.com/api/lock/${vehicleId}`);
        res.status(200).send({ status: 'success', message: 'Vehicle locked successfully' });
    } catch (error) {
        console.error('Error locking vehicle:', error);
        res.status(500).send({ status: 'error', message: 'Error locking vehicle' });
    }
};

const unlockVehicle = async (req, res) => {
    const vehicleId = req.params.id;

    try {
        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' })
        await axios.post(`https://iotdeviceapi.com/api/unlock/${vehicleId}`);
        res.status(200).send({ status: 'success', message: 'Vehicle unlocked successfully' });
    } catch (error) {
        console.error('Error unlocking vehicle:', error);
        res.status(500).send({ status: 'error', message: 'Error unlocking vehicle' });
    }
};


module.exports = { getCars, getCar, getScooters, getScooter, rentCar, rentScooter, rentCar, rentScooter, getRentals, getRental, lockVehicle, unlockVehicle }

