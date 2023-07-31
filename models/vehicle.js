const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vehicleSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['car', 'scooter'],
        required: true
    },
    model: {
        type: String,
        required: true
    },
    seats: {
        type: Number,
        required: true,
        min: 1,
    },
    picture: {
        type: String,
        required: true
    },
    pickUpLocation: {
        type: [Number],  // [longitude, latitude]
        required: true
    },
    dropOffLocation: {
        type: [Number], // [longitude, latitude]
    }
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;