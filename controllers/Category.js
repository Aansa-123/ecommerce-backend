import Category from "../models/Category.js";

export const getAll = async (req, res) => {
  try {
    const result = await Category.find({});
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching categories" });
  }
};
