const express = require('express')
const router = express.Router()

const { authorizeCarOwner, authorizeOwner, authorizeScooterOwner } = require('../middlewares/authorize')
const { addCar, addScooter, editVehicle, deleteVehicle, getVehicles, getVehicle, getMyRentals, getRental, acceptRental, rejectRental } = require('../controllers/vehicleOwner')

router.post('/add-car', authorizeCarOwner, addCar)
router.post('/add-scooter', authorizeScooterOwner, addScooter)
router.delete('/delete-vehicle', authorizeOwner, deleteVehicle)
router.put('/vehicle/:id', authorizeOwner, editVehicle)
router.get('/vehicles', authorizeOwner, getVehicles)
router.get('/vehicle/:id', authorizeOwner, getVehicle)
router.get('/rentals/:id', authorizeOwner, getRental)
router.get('/rentals/', authorizeOwner, getMyRentals)
router.post('/rental/:id', authorizeOwner, acceptRental)
router.post('/rental/:id', authorizeOwner, rejectRental)

module.exports = router