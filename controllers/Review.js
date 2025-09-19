import Review from "../models/Review.js";

export const create = async (req, res) => {
  try {
    const newReview = new Review(req.body);
    await newReview.save();

    // Populate the user field after saving
    const populatedReview = await Review.findById(newReview._id).populate({
      path: "user",
      select: "-password",
    });

    return res.status(201).json(populatedReview);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error posting review, please try again later" });
  }
};

export const getByProductId = async (req, res) => {
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

    const totalDocs = await Review.countDocuments({ product: id });
    const reviews = await Review.find({ product: id })
      .skip(skip)
      .limit(limit)
      .populate("user");

    res.set("X-Total-Count", totalDocs);
    return res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error getting reviews for this product, please try again later" });
  }
};

export const updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReview = await Review.findByIdAndUpdate(id, req.body, { new: true }).populate("user");
    return res.status(200).json(updatedReview);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating review, please try again later" });
  }
};

export const deleteById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await Review.findByIdAndDelete(id);
    return res.status(200).json(deletedReview);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting review, please try again later" });
  }
};
