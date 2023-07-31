const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const AppleStrategy = require('passport-apple').Strategy;
const User = require('../models/user');
const jwt = require('jsonwebtoken')

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// Google
exports.google = passport.use(new GoogleStrategy({

    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:5000/google/callback'
}, function (accessToken, refreshToken, profile, done) {
    User.findOne({ googleId: profile.id }).then(function (existingUser) {
        if (existingUser) {
            done(null, existingUser);
        } else {
            new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                emailVerified: true
            }).save().then(function (user) {
                done(null, user);
            });
            console.log(profile);
        }
    });
}));

// Facebook
exports.facebook = passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:5000/facebook/callback',
    profileFields: ['id', 'emails', 'name', 'photos']
}, function (accessToken, refreshToken, profile, done) {
    User.findOne({ facebookId: profile.id }).then(function (existingUser) {
        if (existingUser) {
            done(null, existingUser);
        } else {
            new User({ facebookId: profile.id, email: profile.emails[0].value, name: profile.name.givenName + ' ' + profile.name.familyName}).save().then(function (user) {
                done(null, user);
            });
        }
    });
}));

// Apple
exports.apple = passport.use(new AppleStrategy({
    clientID: 'YOUR_APPLE_SERVICES_ID',
    teamID: 'YOUR_APPLE_TEAM_ID',
    callbackURL: 'http://localhost:5000/apple/callback',
    keyID: 'YOUR_APPLE_KEY_ID',
    privateKeyLocation: 'path_to_your_private_key.pem'
}, function (accessToken, refreshToken, profile, done) {
    User.findOne({ appleId: profile.id }).then(function (existingUser) {
        if (existingUser) {
            done(null, existingUser);
        } else {
            new User({ appleId: profile.id }).save().then(function (user) {
                done(null, user);
            });
        }
    });
}));