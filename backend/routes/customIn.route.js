import express from "express";
import {executeCustomCode} from "../controllers/customIn.controller.js";
const router = express.Router();

router.post("/",executeCustomCode);

export default router;
