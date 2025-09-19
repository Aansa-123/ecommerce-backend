import Order from "../models/Order.js";

export const create = async (req, res) => {
  try {
    const created = new Order(req.body);
    await created.save();
    return res.status(201).json(created);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error creating an order, please try again later' });
  }
};

export const getByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const results = await Order.find({ user: id });
    return res.status(200).json(results);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching orders, please try again later' });
  }
};

export const getAll = async (req, res) => {
  try {
    let skip = 0;
    let limit = 0;

    if (req.query.page && req.query.limit) {
      const page = parseInt(req.query.page);
      const pageSize = parseInt(req.query.limit);
      skip = pageSize * (page - 1);
      limit = pageSize;
    }

    const totalDocs = await Order.countDocuments();
    const orders = await Order.find({}).skip(skip).limit(limit).exec();

    res.setHeader("X-Total-Count", totalDocs);
    return res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error fetching orders, please try again later' });
  }
};

export const updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Order.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error updating order, please try again later' });
  }
};
