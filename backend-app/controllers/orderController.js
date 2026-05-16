const Order = require("../models/Order");
const Cart = require("../models/Cart");

const createOrder = async (req, res) => {
    const { shippingAddress, totalAmount } = req.body;
    const userId = req.user?.id || req.user?._id || req.userId;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Keranjang kamu kosong, gajadi checkout!" });
        }

        const newOrder = await Order.create({
            userId,
            items: cart.items,
            totalAmount,
            shippingAddress,
        });

        cart.items = [];
        await cart.save();

        res.status(201).json({ message: "Checkout Berhasil!", order: newOrder });
    } catch (error) {
        console.error("Error at createOrder:", error);
        res.status(500).json({ message: error.message });
    }
};

const getUserOrders = async (req, res) => {
    const userId = req.user?.id || req.user?._id || req.userId;

    try {
        const orders = await Order.find({ userId })
            .populate("items.productId")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error("Error at getUserOrders:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder, getUserOrders };