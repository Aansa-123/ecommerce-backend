import express from "express";
import * as wishlistController from "../controllers/Wishlist.js";

const router = express.Router();

router
    .post("/", wishlistController.create)
    .get("/user/:id", wishlistController.getByUserId)
    .patch("/:id", wishlistController.updateById)
    .delete("/:id", wishlistController.deleteById);

export default router;
