const Cart = require("../models/Cart");

const addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    const userId = req.user?.id || req.user?._id || req.userId || (typeof req.user === 'string' ? req.user : null);

    if (!userId) {
        console.log("req.user kosong.");
        return res.status(401).json({ message: "Akses ditolak: Data user tidak terbaca." });
    }

    try {
        let cart = await Cart.findOne({ userId });

        if (cart) {
            const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ productId, quantity });
            }
            cart = await cart.save();
            return res.status(200).json(cart);
        } else {
            const newCart = await Cart.create({
                userId,
                items: [{ productId, quantity }]
            });
            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.error("Error di addToCart:", error);
        res.status(500).json({ message: error.message });
    }
};

const getCart = async (req, res) => {
    const userId = req.user?.id || req.user?._id || req.userId || (typeof req.user === 'string' ? req.user : null);

    if (!userId) {
        return res.status(401).json({ message: "Akses ditolak: Data user tidak terbaca." });
    }

    try {
        const cart = await Cart.findOne({ userId }).populate("items.productId");
        if (!cart) {
            return res.status(200).json({ items: [] });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error("Error di getCart:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addToCart, getCart };