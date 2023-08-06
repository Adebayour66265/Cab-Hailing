const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const { facebook, google, apple } = require("../controllers/userOauth");
const {
  register,
  verifyEmail,
  resendOtp,
  login,
  forgotPassword,
  resetPassword,
  getFcmToken,
} = require("../controllers/userAuth");
const { authorizeUser, verifyUser } = require("../middlewares/authorize");
const {
  getCars,
  getCar,
  getScooters,
  getScooter,
  rentScooter,
  rentCar,
  getRentals,
  getRental,
  lockVehicle,
  unlockVehicle,
} = require("../controllers/userRental");

router.get(
  "/google",
  google.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  google.authenticate("google", { failureRedirect: "/login", session: false }),
  function (req, res) {
    const token = jwt.sign({ email: req.user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ user: req.user, token });
  }
);

router.get(
  "/facebook",
  facebook.authenticate("facebook", { scope: ["profile"] })
);
router.get(
  "/facebook/callback",
  facebook.authenticate("facebook", {
    session: false,
    failureRedirect: "/login",
  }),
  function (req, res) {
    const token = jwt.sign({ email: req.user.email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ user: req.user, token });
  }
);

router.get("/apple", apple.authenticate("apple", { scope: ["profile"] }));
router.get(
  "/apple/callback",
  apple.authenticate("apple", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

router.post("/register", register);
router.post("/verify-email", authorizeUser, verifyEmail);
router.post("/resend-otp", authorizeUser, resendOtp);
router.post("/login", verifyUser, login);
router.post("/forgot-password", verifyUser, forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/cars", authorizeUser, getCars);
router.get("/cars/:id", authorizeUser, getCar);
router.get("/scooters", authorizeUser, getScooters);
router.get("/scooters/:id", authorizeUser, getScooter);
router.post("/cars/:id/rent", authorizeUser, rentCar);
router.post("/scooters/:id/rent", authorizeUser, rentScooter);
router.get("/rentals", authorizeUser, getRentals);
router.get("/rentals/:id", authorizeUser, getRental);
router.post("/fcm-token", authorizeUser, getFcmToken);
router.post("/lock-vehicle/", authorizeUser, lockVehicle);
router.post("/unlock-vehicle/", authorizeUser, unlockVehicle);

module.exports = router;
