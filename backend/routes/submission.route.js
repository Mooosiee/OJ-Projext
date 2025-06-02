import express from "express";
import { submitCode } from "../controllers/submission.controller.js";
import {verifyToken} from "../utils/verifyUser.js";
import { fetchProblemById } from "../utils/fetchProblem.js";
const router = express.Router();

router.post('/',verifyToken,fetchProblemById,submitCode);

export default router;