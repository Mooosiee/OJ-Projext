import express from 'express';
import { createProblems,getAllProblems,getAProblem } from '../controllers/problems.controller.js';
import { verifyToken } from '../utils/verifyUser.js';
const router = express.Router();

router.post('/create',verifyToken,createProblems);
router.get('/all',getAllProblems);
router.get('/:id',getAProblem);

export default router;