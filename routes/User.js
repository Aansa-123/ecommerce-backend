import express from "express";
import * as userController from "../controllers/User.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import mongoose from "mongoose";

const router = express.Router();

// Validate ObjectId for any :id params
router.param("id", (req, res, next, id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user id" });
  }
  next();
});

// Specific routes first to avoid conflicts with dynamic ":id" routes
router
  .patch("/promote", verifyToken, userController.promoteByEmail)
  .patch("/demote", verifyToken, userController.demoteByEmail)
  .get("/:id", userController.getById)
  .patch("/:id", verifyToken, userController.updateById);

export default router;