const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            console.log("Akses ditolak.");
            return res.status(401).json({ message: "Akses ditolak. Silakan login kembali." });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "rahasia_super_aman_123");

        req.user = decoded;

        next();

    } catch (error) {
        console.error("Error authMiddleware:", error.message);
        return res.status(401).json({ message: "Sesi telah habis atau token tidak valid. Silakan login lagi." });
    }
};

module.exports = authMiddleware;