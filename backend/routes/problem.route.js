import express from 'express';
import { createProblems,getAllProblems } from '../controllers/problems.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
const router = express.Router();

router.post('/create',verifyToken,createProblems);
router.get('/',getAllProblems);

export default router;