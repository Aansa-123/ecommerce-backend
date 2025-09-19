import express from "express";
import * as contactController from "../controllers/Contact.js";

const router = express.Router();

router.post("/", contactController.sendMessage);

export default router;
