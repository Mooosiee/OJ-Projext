import express from "express";
import {runCompiler} from "./compiler.controller.js";
const router = express.Router();

router.post("/run",runCompiler);

export default router;