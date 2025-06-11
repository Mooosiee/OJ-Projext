import express from "express";
import {
  createProblems,
  getAllProblems,
  getAProblem,
  updateProblem,
  deleteProblem,
} from "../controllers/problems.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create", verifyToken, createProblems);
router.get("/all", getAllProblems);
router.get("/:id", getAProblem);
router.put("/update/:problemId",verifyToken,updateProblem);
router.delete("/delete/:problemId",verifyToken,deleteProblem);

export default router;
