import express from 'express';
import { createProblems } from '../controllers/problems.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
const router = express.Router();

router.post('/create',verifyToken,createProblems);

export default router;