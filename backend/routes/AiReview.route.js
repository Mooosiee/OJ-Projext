import express from "express";
import { aiReview } from "../controllers/AiReview.controller.js";
const router = express.Router();

router.post("/", aiReview);

export default router;