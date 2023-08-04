const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    googleId: {
        type: String,
    },
    appleId: {
        type: String,
    },
    facebookId: {
        type: String,
    },
    userType: {
        type: String,
        enum: ['rider', 'driver', 'propertyOwner', 'foodVendor', 'carOwner', 'scooterOwner'],
        required: true,
        default: 'rider'
    },
    driverLicense: {
        type: String,
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
        }
    },
    hotelOwnerDetails: {
        hotelName: {
            type: String,
        },
        hotelLocation: {
            type: {
                type: String,
                enum: ['Point'],
            },
            coordinates: {
                type: [Number],
            }
        },
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    shortLetOwnerDetails: {
        propertyAddress: {
            type: String,
        },
        propertyType: {
            type: String,
            enum: ['apartment', 'house', 'other'],
        },
        available: {
            type: Boolean,
            default: false,
        }
    },
    foodDeliveryDetails: {
        restaurantName: {
            type: String,
        },
        restaurantLocation: {
            type: {
                type: String,
                enum: ['Point'],
            },
            coordinates: {
                type: [Number],
            }
        },
    },
    passwordResetOtp: {
        type: String,
    }, 
    passwordResetExpires: {
        type: Date
    },
    fcmToken:{
        type: String,
    },
    referralLink:{
        type: String,
    },
    referrals:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
module.exports = User
