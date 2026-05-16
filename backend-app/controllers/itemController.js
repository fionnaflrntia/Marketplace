const Item = require("../models/Item");

const getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);

  } catch (error) {
    console.error("Error di getItemById:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getItems,
  getItemById,
};
