import Wishlist from "../models/Wishlist.js";

// Add product to wishlist
export const create = async (req, res) => {
  try {
    const created = new Wishlist(req.body);
    await created.save();
    const populated = await created.populate({ path: "product", populate: ["brand", "category"] });
    res.status(201).json(populated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding product to wishlist, please try again later" });
  }
};

// Get wishlist by user ID with pagination
export const getByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    let skip = 0;
    let limit = 0;

    if (req.query.page && req.query.limit) {
      const page = parseInt(req.query.page);
      const pageSize = parseInt(req.query.limit);
      skip = pageSize * (page - 1);
      limit = pageSize;
    }

    const totalResults = await Wishlist.find({ user: id }).countDocuments();
    const result = await Wishlist.find({ user: id })
      .skip(skip)
      .limit(limit)
      .populate({ path: "product", populate: ["brand", "category"] });

    res.set("X-Total-Count", totalResults);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching your wishlist, please try again later" });
  }
};

// Update wishlist item
export const updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Wishlist.findByIdAndUpdate(id, req.body, { new: true }).populate({
      path: "product",
      populate: ["brand", "category"],
    });
    if (!updated) return res.status(404).json({ message: "Wishlist item not found" });
    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating your wishlist, please try again later" });
  }
};

// Delete wishlist item
export const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Wishlist.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Wishlist item not found" });
    res.status(200).json(deleted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting that product from wishlist, please try again later" });
  }
};
