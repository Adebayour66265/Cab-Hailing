const express = require('express')
const router = express.Router()

const {authorizeOwner} = require('../middlewares/authorize')
const {createVehicle} = require('../controllers/vehicleOwner')

router.post('/vehicle', authorizeOwner, createVehicle)

module.exports = router