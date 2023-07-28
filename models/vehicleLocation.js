const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VehicleLocationSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    },
    radius: {
        type: Number,
        required: true
    }
});

const VehicleLocation = mongoose.model('VehicleLocation', VehicleLocationSchema);

module.exports = VehicleLocation;