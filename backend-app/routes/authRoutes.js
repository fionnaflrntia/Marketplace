const express = require("express");
const { register, login } = require("../controllers/authController");

const router = express.Router();

// Public routes (no auth required)
router.post("/register", register);
router.post("/login", login);

module.exports = router;
