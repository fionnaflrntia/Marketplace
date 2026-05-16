const express = require("express");
const { addToCart, getCart } = require("../controllers/cartController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", authMiddleware, getCart);
router.post("/", authMiddleware, addToCart);

module.exports = router;