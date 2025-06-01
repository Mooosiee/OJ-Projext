import express from "express";
import { submitCode } from "../controllers/submission.controller";
import {verifyToken} from "../utils/verifyUser.js";
const router = express.Router();

router.post('/',verifyToken,submitCode);

export default router;