const jwt = require('jsonwebtoken');
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
require('dotenv').config()

const register = async (req, res) => {
    try {
        const { name, email, password, userType } = req.body
        const user = await User.findOne({ email: email })
        if (user) return res.status(401).json({ message: "User already exists" })
        const hashedPassword = await bcrypt.hash(password, 12)
        const otp = Math.floor(1000 + Math.random() * 9000)
        const otpExpires = Date.now() + 360000
        const token = jwt.sign({ email: email }, process.env.JWT_SECRET, { expiresIn: otpExpires })

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
            userType: userType,
            otp: otp.toString(),
        })
        await newUser.save()
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Email Verification",
            html: ` <h2>Dear ${newUser.name},</h2>
            <p>This is your OTP: <strong>${otp}</strong></p>`
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).json({ message: error.message });
            } else {
                console.log("Email sent: " + info.response);
                res.status(201).json({ message: "Registration successful and otp sent", email: email, user: newUser.name, token: token });
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const verifyEmail = async (req, res) => {
    try {
        const { otp } = req.body
        if (!otp) return res.status(400).json({ message: "No OTP Provided" })
        const user = req.user
        if (otp === user.otp) {
            user.otp = null
            user.otpExpires = null
            user.emailVerified = true
            await user.save()
            return res.status(200).json({ message: "OTP Verified" })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const resendOtp = async (req, res) => {
    try {
        const user = req.user
        const otp = Math.floor(1000 + Math.random() * 9000)
        const otpExpires = Date.now() + 360000
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: otpExpires })
        user.otp = otp.toString()
        user.otpExpires = otpExpires
        await user.save()
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Email Verification",
            html: ` <h2>Dear ${user.name},</h2>
            <p>This is your OTP: <strong>${otp}</strong></p>`
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).json({ message: error.message });
            } else {
                console.log("Email sent: " + info.response);
                res.status(200).json({ message: "New otp sent", email: user.email, user: user.name, token: token });
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const login = async (req, res) => {
    try {
        const { password } = req.body
        const user = req.user
        const passwordIsMatch = bcrypt.compare(password, user.password)
        if (!passwordIsMatch) return res.status(401).json({ message: "Invalid Password" })
        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.status(200).json({ token: token, user: user })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const otp = Math.floor(1000 + Math.random() * 9000)
        const user = req.user
        user.passwordResetOtp = otp.toString()
        user.passwordResetExpires = Date.now() + 36000
        user.save()
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        })
        const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Password reset otp",
            html: `Your Password Reset pin is ${otp}`
        }
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                res.status(500).json({ message: error.message });
            } else {
                console.log("Email sent: " + info.response);
                res.status(200).json({ message: "otp sent", email: user.email });
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { password, otp } = req.body
        if (!otp) return res.status(401).json({ message: "Please enter otp"})
        const user = await User.findOne({ passwordResetOtp: otp })
        if (!user) return res.status(404).json({ message: "Invalid otp" })
        if (user.passwordResetExpires > Date.now()) return res.status(401).json({ message: "OTP expired" })
        const hashedPassword = await bcrypt.hash(password, 12)
        user.password = hashedPassword
        user.passwordResetOtp = null,
            user.passwordResetExpires = null
        user.save()
        res.status(200).json({ message: "Password reset successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

const getFcmToken = async (req, res) => {
    try{
        const fcmToken = req.params.fcmToken
        req.user.fcmToken = fcmToken
        req.user.save()
        res.status(200).json({message: "FCM Token saved successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}
module.exports = { register, verifyEmail, resendOtp, login, forgotPassword, resetPassword, getFcmToken }