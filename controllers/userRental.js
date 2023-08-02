const Rental = require('../models/rental')
const Vehicle = require('../models/vehicle')
const admin = require('firebase-admin')
const axios = require('axios')
const jimp = require('jimp')
const jsqr = require('jsqr')

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

async function scanQrCode(image) {
    const img = await Jimp.read(image);
    const decoded = jsQR(img.bitmap.data, img.bitmap.width, img.bitmap.height);
    return decoded && decoded.data;
}


const lockVehicle = async (req, res) => {
    try {
        const qrCodeImage = req.body.qrCodeImage;
        const qrCodeData = await scanQrCode(qrCodeImage);
        const vehicle = await Vehicle.findOne({ qrCode: qrCodeData })
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found" })
        const response = await axios.post('http://hardware-api.com/lock', { vehicleId: vehicle.id });
        res.status(200).json({ message: "vehicle locked" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to lock vehicle" + error.message })
    }
}

const unlockVehicle = async (req, res) => {
    try {
        const qrCodeImage = req.body.qrCodeImage;
        const qrCodeData = await scanQrCode(qrCodeImage);
        const vehicle = await Vehicle.findOne({ qrCode: qrCodeData })
        if (!vehicle) return res.status(404).json({ message: "Vehicle not found" })
        const response = await axios.post('http://hardware-api.com/unlock', { vehicleId: vehicle.id });
        res.status(200).json({ message: "vehicle unlocked" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Failed to unlock vehicle" + error.message })
    }
}

module.exports = { getCars, getCar, getScooters, getScooter, rentCar, rentScooter, rentCar, rentScooter, getRentals, getRental, lockVehicle, unlockVehicle }

