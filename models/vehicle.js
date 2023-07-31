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
    pickUpDate:{
        type: Date,
    },
    seats: {
        type: Number,
        required: true,
        default: 1
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
    },
    price: {
        type: Number,
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    qrCode:{
        type: String,
        required: true
    },
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;