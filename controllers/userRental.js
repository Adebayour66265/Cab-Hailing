const Rental = require('../models/rental')

const createRental = async (req, res) => {
    try{
        const {rentalEndDate} = req.body
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
}