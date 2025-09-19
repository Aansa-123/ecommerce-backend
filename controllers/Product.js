import Product from "../models/Product.js";

export const create = async (req, res) => {
  try {
    const created = new Product(req.body);
    await created.save();
    return res.status(201).json(created);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding product, please try again later' });
  }
};

export const getAll = async (req, res) => {
  try {
    const filter = {};
    const sort = {};
    let skip = 0;
    let limit = 0;

    if (req.query.brand) filter.brand = { $in: req.query.brand };
    if (req.query.category) filter.category = { $in: req.query.category };
    if (req.query.user) filter.isDeleted = false;
    if (req.query.sort) sort[req.query.sort] = req.query.order === 'asc' ? 1 : -1;

    if (req.query.page && req.query.limit) {
      const page = parseInt(req.query.page);
      const pageSize = parseInt(req.query.limit);
      skip = pageSize * (page - 1);
      limit = pageSize;
    }

    const totalDocs = await Product.find(filter).sort(sort).populate("brand").countDocuments();
    const products = await Product.find(filter).sort(sort).populate("brand").skip(skip).limit(limit);

    res.set("X-Total-Count", totalDocs);
    return res.status(200).json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching products, please try again later' });
  }
};

export const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await Product.findById(id).populate("brand").populate("category");
    return res.status(200).json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error getting product details, please try again later' });
  }
};

export const updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(updatedProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating product, please try again later' });
  }
};

export const undeleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const restoredProduct = await Product.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    ).populate("brand");
    return res.status(200).json(restoredProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error restoring product, please try again later' });
  }
};

export const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    ).populate("brand");
    return res.status(200).json(deletedProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error deleting product, please try again later' });
  }
};
