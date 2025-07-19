import express from "express";
import {submitCompiler,runCompiler} from "./compiler.controller.js";

const router = express.Router();
router.post("/run",submitCompiler);
router.post("/custom-in-run", runCompiler);
export default router;