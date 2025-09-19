import Cart from '../models/Cart.js';

// Add product to cart
export const create = async (req, res) => {
  try {
    const created = await new Cart(req.body).save();
    const populated = await created.populate({ path: "product", populate: { path: "brand" } });
    return res.status(201).json(populated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error adding product to cart, please try again later' });
  }
};

// Get cart items by user ID
export const getByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const items = await Cart.find({ user: id }).populate({ path: "product", populate: { path: "brand" } });
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching cart items, please try again later' });
  }
};

// Update a cart item
export const updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Cart.findByIdAndUpdate(id, req.body, { new: true })
      .populate({ path: "product", populate: { path: "brand" } });

    if (!updated) return res.status(404).json({ message: "Cart item not found" });
    return res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error updating cart item, please try again later' });
  }
};

// Delete a single cart item
export const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Cart.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Cart item not found" });
    return res.status(200).json(deleted);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error deleting cart item, please try again later' });
  }
};

// Clear all cart items for a user
export const deleteByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.deleteMany({ user: id });
    return res.sendStatus(204);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error clearing cart, please try again later' });
  }
};
