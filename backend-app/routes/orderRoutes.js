const express = require("express");
const { createOrder, getUserOrders } = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createOrder);
router.get("/", authMiddleware, getUserOrders);

module.exports = router;